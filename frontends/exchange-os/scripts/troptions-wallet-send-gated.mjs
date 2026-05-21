#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Client, Wallet } from "xrpl";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_PATH = path.join(__dirname, "../data/troptions-wallet-transfer-log.json");

const args = new Set(process.argv.slice(2));
const isMainnet = args.has("--mainnet");
const hasConfirm = args.has("--confirm");

const env = {
  enableLive: process.env.TROPTIONS_ENABLE_LIVE_SEND === "true",
  legalApproved: process.env.TROPTIONS_LEGAL_APPROVED === "true",
  operatorConfirmed: process.env.TROPTIONS_OPERATOR_CONFIRMED === "true",
  secureSignerMode: process.env.TROPTIONS_SECURE_SIGNER_MODE === "true",
  senderSeed: process.env.TROPTIONS_XRPL_SENDER_SEED ?? "",
  destination: process.env.TROPTIONS_XRPL_DESTINATION ?? "",
  currency: process.env.TROPTIONS_XRPL_CURRENCY ?? "",
  issuer: process.env.TROPTIONS_XRPL_ISSUER ?? "",
  amount: process.env.TROPTIONS_XRPL_AMOUNT ?? "",
  routeType: process.env.TROPTIONS_WALLET_ROUTE_TYPE ?? "XRPL_IOU_PAYMENT",
};

function nowIso() {
  return new Date().toISOString();
}

function safeLog(message, data) {
  if (data) {
    console.log(message, JSON.stringify(data, null, 2));
  } else {
    console.log(message);
  }
}

function appendSanitizedLog(entry) {
  const payload = {
    timestamp: nowIso(),
    ...entry,
  };

  let existing = [];
  if (fs.existsSync(LOG_PATH)) {
    try {
      existing = JSON.parse(fs.readFileSync(LOG_PATH, "utf8"));
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }
  }

  existing.push(payload);
  fs.writeFileSync(LOG_PATH, JSON.stringify(existing, null, 2));
}

function requiredFlagsReady() {
  return env.enableLive && env.legalApproved && env.operatorConfirmed && env.secureSignerMode;
}

function sanitizeError(error) {
  const text = String(error?.message ?? error ?? "Unknown error");
  return text.replace(/s[1-9A-HJ-NP-Za-km-z]{20,}/g, "[REDACTED_SEED]");
}

function validateInput() {
  const reasons = [];
  if (!env.destination) reasons.push("Missing TROPTIONS_XRPL_DESTINATION");
  if (!env.currency) reasons.push("Missing TROPTIONS_XRPL_CURRENCY");
  if (!env.issuer) reasons.push("Missing TROPTIONS_XRPL_ISSUER");
  if (!env.amount || Number(env.amount) <= 0) reasons.push("Missing or invalid TROPTIONS_XRPL_AMOUNT");
  return reasons;
}

async function runXrplFlow() {
  const endpoint = isMainnet ? "wss://xrplcluster.com" : "wss://s.altnet.rippletest.net:51233";
  const liveRequested = requiredFlagsReady() && isMainnet && hasConfirm;

  safeLog("TROPTIONS Wallet Send (Gated)");
  safeLog("Mode", {
    routeType: env.routeType,
    network: isMainnet ? "XRPL Mainnet" : "XRPL Testnet",
    dryRun: !liveRequested,
  });

  const inputReasons = validateInput();
  if (inputReasons.length) {
    appendSanitizedLog({ status: "BLOCKED", routeType: env.routeType, reasons: inputReasons });
    safeLog("Blocked:", { reasons: inputReasons });
    process.exitCode = 1;
    return;
  }

  if (!liveRequested) {
    const reasons = [];
    if (!requiredFlagsReady()) reasons.push("Live env gates are not all true.");
    if (!isMainnet) reasons.push("--mainnet flag missing.");
    if (!hasConfirm) reasons.push("--confirm flag missing.");

    safeLog("Dry run summary", {
      from: "[from seed in env only]",
      to: env.destination,
      currency: env.currency,
      issuer: env.issuer,
      amount: env.amount,
      reasons,
    });

    appendSanitizedLog({
      status: "DRY_RUN",
      routeType: env.routeType,
      destination: env.destination,
      currency: env.currency,
      issuer: env.issuer,
      amount: env.amount,
      reasons,
    });
    return;
  }

  if (!env.senderSeed) {
    appendSanitizedLog({ status: "BLOCKED", routeType: env.routeType, reasons: ["Missing TROPTIONS_XRPL_SENDER_SEED"] });
    safeLog("Blocked: sender seed missing in runtime env.");
    process.exitCode = 1;
    return;
  }

  const client = new Client(endpoint);
  try {
    await client.connect();

    const wallet = Wallet.fromSeed(env.senderSeed);

    const senderInfo = await client.request({
      command: "account_info",
      account: wallet.address,
      ledger_index: "validated",
    });

    const senderExists = Boolean(senderInfo?.result?.account_data?.Account);
    if (!senderExists) {
      appendSanitizedLog({ status: "BLOCKED", routeType: env.routeType, reasons: ["Sender account does not exist"] });
      safeLog("Blocked: sender account does not exist on target network.");
      process.exitCode = 1;
      return;
    }

    const destinationLines = await client.request({
      command: "account_lines",
      account: env.destination,
      ledger_index: "validated",
    }).catch(() => null);

    const destinationHasTrustline = Boolean(
      destinationLines?.result?.lines?.some(
        (line) => line.currency === env.currency && line.account === env.issuer,
      ),
    );

    if (!destinationHasTrustline) {
      appendSanitizedLog({
        status: "BLOCKED",
        routeType: env.routeType,
        reasons: ["Destination trustline for issued currency not found"],
        destination: env.destination,
        currency: env.currency,
        issuer: env.issuer,
      });
      safeLog("Blocked: destination trustline not found for issued currency.");
      process.exitCode = 1;
      return;
    }

    const tx = {
      TransactionType: "Payment",
      Account: wallet.address,
      Destination: env.destination,
      Amount: {
        currency: env.currency,
        issuer: env.issuer,
        value: String(env.amount),
      },
      Memos: [
        {
          Memo: {
            MemoType: Buffer.from("troptions-wallet-hub", "utf8").toString("hex").toUpperCase(),
            MemoData: Buffer.from("operator-gated-send", "utf8").toString("hex").toUpperCase(),
          },
        },
      ],
    };

    const prepared = await client.autofill(tx);
    const signed = wallet.sign(prepared);
    const submitted = await client.submitAndWait(signed.tx_blob);

    const txHash = signed.hash;
    appendSanitizedLog({
      status: "SUBMITTED",
      routeType: env.routeType,
      network: "XRPL Mainnet",
      destination: env.destination,
      currency: env.currency,
      issuer: env.issuer,
      amount: env.amount,
      txHash,
    });

    safeLog("Submitted XRPL payment", {
      txHash,
      engineResult: submitted.result.meta?.TransactionResult ?? "unknown",
      destination: env.destination,
      currency: env.currency,
      amount: env.amount,
    });
  } catch (error) {
    const safeMessage = sanitizeError(error);
    appendSanitizedLog({ status: "FAILED", routeType: env.routeType, error: safeMessage });
    safeLog("Transfer failed", { error: safeMessage });
    process.exitCode = 1;
  } finally {
    if (client.isConnected()) await client.disconnect();
  }
}

async function runStellarFlow() {
  const summary = {
    routeType: env.routeType,
    status: "SIMULATION_ONLY",
    note: "Stellar live send requires secure signer integration and is intentionally disabled.",
    destination: env.destination || "(not set)",
    amount: env.amount || "(not set)",
  };
  appendSanitizedLog(summary);
  safeLog("Stellar route simulation", summary);
}

async function runInternalLedgerFlow() {
  const summary = {
    routeType: env.routeType,
    status: "SIMULATED",
    note: "Internal ledger transfer simulation only. No live movement performed.",
    destination: env.destination || "(not set)",
    amount: env.amount || "(not set)",
  };
  appendSanitizedLog(summary);
  safeLog("Internal ledger simulation", summary);
}

(async function main() {
  try {
    if (env.routeType === "XRPL_IOU_PAYMENT") {
      await runXrplFlow();
      return;
    }

    if (env.routeType === "STELLAR_ASSET_PAYMENT") {
      await runStellarFlow();
      return;
    }

    await runInternalLedgerFlow();
  } catch (error) {
    const safeMessage = sanitizeError(error);
    appendSanitizedLog({ status: "FAILED", error: safeMessage });
    safeLog("Fatal error", { error: safeMessage });
    process.exitCode = 1;
  }
})();
