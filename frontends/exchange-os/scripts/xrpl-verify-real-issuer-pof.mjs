#!/usr/bin/env node
/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateWalletControlProof, mergeProofInput } from "./xrpl-verify-wallet-control.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_RPCS = ["https://s1.ripple.com:51234/", "https://xrplcluster.com/"];

function parseArgs(argv) {
  const args = {
    hashes: [],
    holder: "",
    asset: "USDC",
    issuerClass: "official",
    minBalance: "0",
    allowlist: path.join(__dirname, "config", "xrpl-asset-allowlist.json"),
    rpcs: [...DEFAULT_RPCS],
    walletProofFile: "",
    walletChallenge: "",
    walletChallengeEncoding: "auto",
    walletSignature: "",
    walletPublicKey: "",
    walletIssuedAt: "",
    walletExpiresAt: "",
    walletNonce: "",
    out: "",
    json: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const cur = argv[i];
    if (cur === "--hash" && argv[i + 1]) args.hashes.push(argv[++i].toUpperCase());
    else if (cur === "--holder" && argv[i + 1]) args.holder = argv[++i];
    else if (cur === "--asset" && argv[i + 1]) args.asset = argv[++i].toUpperCase();
    else if (cur === "--issuer-class" && argv[i + 1]) args.issuerClass = argv[++i].toLowerCase();
    else if (cur === "--min-balance" && argv[i + 1]) args.minBalance = argv[++i];
    else if (cur === "--allowlist" && argv[i + 1]) args.allowlist = argv[++i];
    else if (cur === "--rpc" && argv[i + 1]) args.rpcs = argv[++i].split(",").map((v) => v.trim()).filter(Boolean);
    else if (cur === "--wallet-proof-file" && argv[i + 1]) args.walletProofFile = argv[++i];
    else if (cur === "--wallet-challenge" && argv[i + 1]) args.walletChallenge = argv[++i];
    else if (cur === "--wallet-challenge-encoding" && argv[i + 1]) args.walletChallengeEncoding = argv[++i].toLowerCase();
    else if (cur === "--wallet-signature" && argv[i + 1]) args.walletSignature = argv[++i];
    else if (cur === "--wallet-public-key" && argv[i + 1]) args.walletPublicKey = argv[++i];
    else if (cur === "--wallet-issued-at" && argv[i + 1]) args.walletIssuedAt = argv[++i];
    else if (cur === "--wallet-expires-at" && argv[i + 1]) args.walletExpiresAt = argv[++i];
    else if (cur === "--wallet-nonce" && argv[i + 1]) args.walletNonce = argv[++i];
    else if (cur === "--out" && argv[i + 1]) args.out = argv[++i];
    else if (cur === "--json") args.json = true;
  }

  return args;
}

function decodeCurrency(currency) {
  if (!currency) return "";
  if (/^[A-Z0-9]{3}$/.test(currency)) return currency;
  if (!/^[0-9A-Fa-f]{40}$/.test(currency)) return currency;
  const bytes = currency.match(/.{2}/g)?.map((h) => Number.parseInt(h, 16)) ?? [];
  const ascii = bytes.filter((b) => b !== 0).map((b) => String.fromCharCode(b)).join("");
  return ascii || currency;
}

function normalizeDecimal(value) {
  const input = String(value ?? "0").trim();
  if (!/^[-+]?\d+(\.\d+)?$/.test(input)) {
    throw new Error(`Invalid decimal value: ${value}`);
  }

  const negative = input.startsWith("-");
  const unsigned = input.replace(/^[-+]/, "");
  const [wholeRaw, fracRaw = ""] = unsigned.split(".");
  const whole = wholeRaw.replace(/^0+(?=\d)/, "") || "0";
  const frac = fracRaw.replace(/0+$/, "");

  return {
    negative,
    whole,
    frac,
    normalized: `${negative ? "-" : ""}${whole}${frac ? `.${frac}` : ""}`,
  };
}

function compareDecimalStrings(a, b) {
  const left = normalizeDecimal(a);
  const right = normalizeDecimal(b);

  if (left.normalized === right.normalized) return 0;
  if (left.negative && !right.negative) return -1;
  if (!left.negative && right.negative) return 1;

  const sign = left.negative ? -1 : 1;

  if (left.whole.length !== right.whole.length) {
    return left.whole.length > right.whole.length ? sign : -sign;
  }

  if (left.whole !== right.whole) {
    return left.whole > right.whole ? sign : -sign;
  }

  const maxFrac = Math.max(left.frac.length, right.frac.length);
  const leftFrac = left.frac.padEnd(maxFrac, "0");
  const rightFrac = right.frac.padEnd(maxFrac, "0");
  if (leftFrac === rightFrac) return 0;
  return leftFrac > rightFrac ? sign : -sign;
}

async function callRpc(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const data = await res.json();
  if (data?.result?.error) throw new Error(`RPC ${data.result.error}: ${data.result.error_message || ""}`.trim());
  return data.result;
}

async function callRpcWithFallback(rpcs, body) {
  let lastErr = "";
  for (const rpc of rpcs) {
    try {
      const result = await callRpc(rpc, body);
      return { rpc, result };
    } catch (err) {
      lastErr = `${rpc} -> ${err.message}`;
    }
  }
  throw new Error(`All RPC calls failed. Last error: ${lastErr}`);
}

function extractCandidates(txResult) {
  const tx = txResult.tx_json || txResult;
  const candidates = [];

  const pushCandidate = (node, field) => {
    if (node && typeof node === "object" && node.issuer && node.currency) {
      candidates.push({
        field,
        issuer: node.issuer,
        currency: node.currency,
        currencyDecoded: decodeCurrency(node.currency),
        value: node.value ?? null,
      });
    }
  };

  pushCandidate(tx.Amount, "Amount");
  pushCandidate(tx.DeliverMax, "DeliverMax");
  pushCandidate(txResult.meta?.delivered_amount, "meta.delivered_amount");
  pushCandidate(tx.LimitAmount, "LimitAmount");

  return {
    hash: tx.hash || txResult.hash,
    transactionType: tx.TransactionType,
    account: tx.Account,
    destination: tx.Destination,
    validated: Boolean(txResult.validated),
    transactionResult: txResult.meta?.TransactionResult,
    candidates,
  };
}

function evaluateTransaction(txSummary, asset, allowedIssuers) {
  const allowed = new Set(allowedIssuers);
  const assetCandidates = txSummary.candidates.filter((c) => c.currencyDecoded === asset || c.currency === asset);
  const issuerMatches = assetCandidates.filter((c) => allowed.has(c.issuer));

  return {
    hash: txSummary.hash,
    transactionType: txSummary.transactionType,
    validated: txSummary.validated,
    transactionResult: txSummary.transactionResult,
    assetCandidates,
    issuerMatches,
    checks: {
      validated: txSummary.validated,
      success: txSummary.transactionResult === "tesSUCCESS",
      issuerMatch: issuerMatches.length > 0,
    },
  };
}

function evaluateBalance(lines, asset, allowedIssuers, minBalance) {
  const issuerSet = new Set(allowedIssuers);
  const matches = lines.filter((line) => decodeCurrency(line.currency) === asset && issuerSet.has(line.account));

  let highestBalance = "0";
  for (const m of matches) {
    if (compareDecimalStrings(m.balance ?? "0", highestBalance) > 0) highestBalance = m.balance ?? "0";
  }

  return {
    trustlineMatches: matches.map((m) => ({
      issuer: m.account,
      currency: m.currency,
      currencyDecoded: decodeCurrency(m.currency),
      balance: m.balance,
      limit: m.limit,
      noRipple: m.no_ripple,
      noRipplePeer: m.no_ripple_peer,
      freeze: m.freeze,
      freezePeer: m.freeze_peer,
    })),
    highestBalance,
    checks: {
      trustlinePresent: matches.length > 0,
      minBalance: compareDecimalStrings(highestBalance, minBalance) >= 0,
    },
  };
}

function buildSummary(input) {
  const txFailures = input.txReports.filter((r) => !(r.checks.validated && r.checks.success && r.checks.issuerMatch));
  const checks = {
    issuerClassScope: input.issuerClass,
    txAllPass: txFailures.length === 0,
    trustlinePresent: input.balanceReport.checks.trustlinePresent,
    minBalance: input.balanceReport.checks.minBalance,
    walletControlSignedMessage: Boolean(input.walletControlProof?.pass),
    sourceOfFundsMemo: false,
    complianceSignoff: false,
  };

  const onChainIssuerAndTxEvidence = checks.txAllPass && checks.trustlinePresent && checks.minBalance;
  const proofOfFundsComplete = onChainIssuerAndTxEvidence
    && checks.walletControlSignedMessage
    && checks.sourceOfFundsMemo
    && checks.complianceSignoff;

  const missing = [];
  if (!checks.walletControlSignedMessage) missing.push("wallet-control signed message");
  if (!checks.sourceOfFundsMemo) missing.push("source-of-funds memo");
  if (!checks.complianceSignoff) missing.push("compliance sign-off");

  return {
    generatedAt: new Date().toISOString(),
    asset: input.asset,
    issuerClass: input.issuerClass,
    holder: input.holder,
    allowedIssuers: input.allowedIssuers,
    minBalanceRequired: input.minBalance,
    ledgerIndex: input.ledgerIndex,
    txReports: input.txReports,
    balanceReport: input.balanceReport,
    walletControlProof: input.walletControlProof || null,
    checks,
    institutionalDetermination: {
      onChainIssuerAndTxEvidence,
      proofOfFundsComplete,
      reason: proofOfFundsComplete
        ? "POF complete based on current report inputs."
        : `POF remains incomplete until ${missing.join(", ")} are attached.`,
    },
  };
}

function printHuman(report) {
  console.log("\nXRPL Real-Issuer PoF Verification");
  console.log("=".repeat(72));
  console.log(`Asset: ${report.asset}`);
  console.log(`Issuer class: ${report.issuerClass}`);
  console.log(`Holder: ${report.holder}`);
  console.log(`Ledger: ${report.ledgerIndex}`);
  console.log(`Allowed issuers: ${report.allowedIssuers.join(", ")}`);
  console.log(`TX set pass: ${report.checks.txAllPass ? "PASS" : "FAIL"}`);
  console.log(`Trustline present: ${report.checks.trustlinePresent ? "PASS" : "FAIL"}`);
  console.log(`Minimum balance check: ${report.checks.minBalance ? "PASS" : "FAIL"}`);
  console.log(`Wallet-control signature: ${report.checks.walletControlSignedMessage ? "PASS" : "MISSING/FAIL"}`);
  console.log(`On-chain issuer/tx evidence: ${report.institutionalDetermination.onChainIssuerAndTxEvidence ? "PASS" : "FAIL"}`);
  console.log(`Institutional POF complete: ${report.institutionalDetermination.proofOfFundsComplete ? "PASS" : "INCOMPLETE"}`);

  if (report.walletControlProof) {
    console.log("\nWallet-control details:");
    console.log(`  signerAddress=${report.walletControlProof.signerAddress}`);
    console.log(`  signatureValid=${report.walletControlProof.checks.signatureValid}`);
    console.log(`  holderMatchesSigner=${report.walletControlProof.checks.holderMatchesSigner}`);
    console.log(`  notExpired=${report.walletControlProof.checks.notExpired}`);
  }

  for (const tx of report.txReports) {
    const txPass = tx.checks.validated && tx.checks.success && tx.checks.issuerMatch;
    console.log(`\n- Hash ${tx.hash} -> ${txPass ? "PASS" : "FAIL"}`);
    console.log(`  validated=${tx.checks.validated} result=${tx.transactionResult} issuerMatch=${tx.checks.issuerMatch}`);
    for (const c of tx.assetCandidates) {
      console.log(`  candidate field=${c.field} issuer=${c.issuer} currency=${c.currencyDecoded} value=${c.value}`);
    }
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.holder || args.hashes.length === 0) {
    console.error("Usage: node scripts/xrpl-verify-real-issuer-pof.mjs --holder <XRPL_ADDRESS> --hash <TX_HASH> [--hash <TX_HASH2>] [--asset USDC] [--issuer-class official|internal|any] [--min-balance 1000] [--wallet-proof-file wallet-proof.json | --wallet-challenge <TEXT_OR_HEX> --wallet-signature <SIG_HEX> --wallet-public-key <PUBKEY_HEX>] [--json] [--out reports/pof.json]");
    process.exit(1);
  }

  if (!["official", "internal", "any"].includes(args.issuerClass)) {
    console.error("--issuer-class must be one of: official, internal, any");
    process.exit(1);
  }

  const allowlist = JSON.parse(fs.readFileSync(args.allowlist, "utf8"));
  const assetCfg = allowlist.assets.find((a) => a.symbol === args.asset);
  if (!assetCfg) {
    console.error(`Asset ${args.asset} not found in allowlist ${args.allowlist}`);
    process.exit(1);
  }

  const scopedIssuers = (assetCfg.approvedIssuers || []).filter((i) => args.issuerClass === "any" || i.class === args.issuerClass);
  const allowedIssuers = scopedIssuers.map((i) => i.address);
  if (allowedIssuers.length === 0) {
    console.error(`No approved issuers found for asset=${args.asset} class=${args.issuerClass}`);
    process.exit(1);
  }

  const txReports = [];
  for (const hash of args.hashes) {
    const txCall = await callRpcWithFallback(args.rpcs, { method: "tx", params: [{ transaction: hash }] });
    const txSummary = extractCandidates(txCall.result);
    const txReport = evaluateTransaction(txSummary, args.asset, allowedIssuers);
    txReport.rpc = txCall.rpc;
    txReports.push(txReport);
  }

  const linesCall = await callRpcWithFallback(args.rpcs, {
    method: "account_lines",
    params: [{ account: args.holder, ledger_index: "validated", limit: 400 }],
  });

  const balanceReport = evaluateBalance(linesCall.result.lines || [], args.asset, allowedIssuers, args.minBalance);

  const hasWalletProofInput = Boolean(
    args.walletProofFile
    || args.walletChallenge
    || args.walletSignature
    || args.walletPublicKey,
  );

  let walletControlProof = null;
  if (hasWalletProofInput) {
    const walletInput = mergeProofInput({
      holder: args.holder,
      challenge: args.walletChallenge,
      challengeEncoding: args.walletChallengeEncoding,
      signature: args.walletSignature,
      publicKey: args.walletPublicKey,
      issuedAt: args.walletIssuedAt,
      expiresAt: args.walletExpiresAt,
      nonce: args.walletNonce,
      proofFile: args.walletProofFile,
    });
    walletControlProof = evaluateWalletControlProof(walletInput);
  }

  const report = buildSummary({
    asset: args.asset,
    issuerClass: args.issuerClass,
    holder: args.holder,
    allowedIssuers,
    minBalance: args.minBalance,
    ledgerIndex: linesCall.result.ledger_index || linesCall.result.ledger_current_index || null,
    txReports,
    balanceReport,
    walletControlProof,
  });

  if (args.out) {
    const outPath = path.isAbsolute(args.out) ? args.out : path.join(process.cwd(), args.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  }

  if (args.json) console.log(JSON.stringify(report, null, 2));
  else printHuman(report);

  const pass = report.institutionalDetermination.onChainIssuerAndTxEvidence;
  process.exit(pass ? 0 : 2);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
