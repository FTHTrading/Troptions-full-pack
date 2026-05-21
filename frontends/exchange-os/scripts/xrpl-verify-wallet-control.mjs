#!/usr/bin/env node
/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deriveAddress, isValidClassicAddress, verifyKeypairSignature, xAddressToClassicAddress } from "xrpl";

function parseArgs(argv) {
  const args = {
    holder: "",
    challenge: "",
    challengeEncoding: "auto",
    signature: "",
    publicKey: "",
    issuedAt: "",
    expiresAt: "",
    nonce: "",
    proofFile: "",
    json: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const cur = argv[i];
    if (cur === "--holder" && argv[i + 1]) args.holder = argv[++i];
    else if (cur === "--challenge" && argv[i + 1]) args.challenge = argv[++i];
    else if (cur === "--challenge-encoding" && argv[i + 1]) args.challengeEncoding = argv[++i].toLowerCase();
    else if (cur === "--signature" && argv[i + 1]) args.signature = argv[++i];
    else if (cur === "--public-key" && argv[i + 1]) args.publicKey = argv[++i];
    else if (cur === "--issued-at" && argv[i + 1]) args.issuedAt = argv[++i];
    else if (cur === "--expires-at" && argv[i + 1]) args.expiresAt = argv[++i];
    else if (cur === "--nonce" && argv[i + 1]) args.nonce = argv[++i];
    else if (cur === "--proof-file" && argv[i + 1]) args.proofFile = argv[++i];
    else if (cur === "--json") args.json = true;
  }

  return args;
}

function normalizeClassicAddress(address) {
  const value = String(address || "").trim();
  if (!value) return "";

  if (isValidClassicAddress(value)) return value;

  try {
    return xAddressToClassicAddress(value).classicAddress;
  } catch {
    return value;
  }
}

function looksLikeHex(input) {
  const value = String(input || "").trim();
  return value.length > 0 && value.length % 2 === 0 && /^[0-9A-Fa-f]+$/.test(value);
}

function toHex(input, encoding = "auto") {
  const raw = String(input || "").trim();
  if (!raw) return "";

  if (encoding === "hex") {
    const clean = raw.replace(/^0x/i, "");
    if (!looksLikeHex(clean)) throw new Error("Challenge declared as hex but value is not valid hex.");
    return clean.toUpperCase();
  }

  if (encoding === "utf8") {
    return Buffer.from(raw, "utf8").toString("hex").toUpperCase();
  }

  const autoClean = raw.replace(/^0x/i, "");
  if (looksLikeHex(autoClean)) return autoClean.toUpperCase();
  return Buffer.from(raw, "utf8").toString("hex").toUpperCase();
}

function mergeProofInput(args) {
  let filePayload = {};
  if (args.proofFile) {
    const abs = path.isAbsolute(args.proofFile) ? args.proofFile : path.join(process.cwd(), args.proofFile);
    filePayload = JSON.parse(fs.readFileSync(abs, "utf8"));
  }

  return {
    holder: args.holder || filePayload.holder || "",
    challenge: args.challenge || filePayload.challenge || "",
    challengeEncoding: args.challengeEncoding !== "auto" ? args.challengeEncoding : (filePayload.challengeEncoding || "auto"),
    signature: args.signature || filePayload.signature || "",
    publicKey: args.publicKey || filePayload.publicKey || "",
    issuedAt: args.issuedAt || filePayload.issuedAt || "",
    expiresAt: args.expiresAt || filePayload.expiresAt || "",
    nonce: args.nonce || filePayload.nonce || "",
  };
}

function evaluateWalletControlProof(input) {
  const warnings = [];

  const holderClassic = normalizeClassicAddress(input.holder);
  const signerAddress = deriveAddress(input.publicKey);
  const challengeHex = toHex(input.challenge, input.challengeEncoding);
  const signatureValid = verifyKeypairSignature(challengeHex, input.signature, input.publicKey);
  const holderMatchesSigner = holderClassic === signerAddress;
  const challengeBindsHolder = input.challenge.includes(holderClassic);

  let notExpired = true;
  if (input.expiresAt) {
    const expires = new Date(input.expiresAt).getTime();
    notExpired = Number.isFinite(expires) && Date.now() <= expires;
  }

  const hasIssuedAt = Boolean(input.issuedAt) || /issuedAt|timestamp|time/i.test(input.challenge);
  const hasNonce = Boolean(input.nonce) || /nonce\s*[:=]/i.test(input.challenge);

  if (!hasIssuedAt) warnings.push("Challenge missing explicit timestamp field (issuedAt/timestamp).");
  if (!hasNonce) warnings.push("Challenge missing explicit nonce field.");
  if (!challengeBindsHolder) warnings.push("Challenge text does not embed holder address string.");

  const checks = {
    signatureValid,
    holderMatchesSigner,
    challengeBindsHolder,
    hasIssuedAt,
    hasNonce,
    notExpired,
  };

  return {
    generatedAt: new Date().toISOString(),
    holder: input.holder,
    holderClassic,
    signerAddress,
    publicKey: input.publicKey,
    issuedAt: input.issuedAt || null,
    expiresAt: input.expiresAt || null,
    nonce: input.nonce || null,
    challengeEncoding: input.challengeEncoding,
    challengeHex,
    checks,
    warnings,
    pass: signatureValid && holderMatchesSigner && notExpired,
  };
}

function assertRequired(input) {
  const missing = [];
  if (!input.holder) missing.push("holder");
  if (!input.challenge) missing.push("challenge");
  if (!input.signature) missing.push("signature");
  if (!input.publicKey) missing.push("publicKey");
  if (missing.length > 0) {
    throw new Error(`Missing required proof fields: ${missing.join(", ")}`);
  }
}

function printHuman(result) {
  console.log("\nXRPL Wallet-Control Verification");
  console.log("=".repeat(72));
  console.log(`Holder: ${result.holderClassic}`);
  console.log(`Derived signer address: ${result.signerAddress}`);
  console.log(`Signature valid: ${result.checks.signatureValid ? "PASS" : "FAIL"}`);
  console.log(`Signer matches holder: ${result.checks.holderMatchesSigner ? "PASS" : "FAIL"}`);
  console.log(`Challenge not expired: ${result.checks.notExpired ? "PASS" : "FAIL"}`);
  console.log(`Overall wallet-control status: ${result.pass ? "PASS" : "FAIL"}`);

  if (result.warnings.length > 0) {
    console.log("Warnings:");
    for (const w of result.warnings) console.log(`  - ${w}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const input = mergeProofInput(args);

  try {
    assertRequired(input);
  } catch (err) {
    console.error("Usage: node scripts/xrpl-verify-wallet-control.mjs --holder <XRPL_ADDRESS> --challenge <TEXT_OR_HEX> --signature <SIG_HEX> --public-key <PUBKEY_HEX> [--challenge-encoding auto|utf8|hex] [--issued-at ISO] [--expires-at ISO] [--nonce value] [--proof-file path.json] [--json]");
    console.error(err.message);
    process.exit(1);
  }

  const result = evaluateWalletControlProof(input);
  if (args.json) console.log(JSON.stringify(result, null, 2));
  else printHuman(result);
  process.exit(result.pass ? 0 : 2);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

export { evaluateWalletControlProof, mergeProofInput };
