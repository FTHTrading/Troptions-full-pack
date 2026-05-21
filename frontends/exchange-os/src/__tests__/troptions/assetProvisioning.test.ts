/**
 * Asset Provisioning Tests
 *
 * Verifies:
 * - policy engine blocks every live write without approvals
 * - policy engine blocks mainnet unconditionally (current policy)
 * - dry-run is the default decision
 * - metadata files exist and pass standards checks
 * - banned compliance language is absent from every metadata file
 * - the broadcast script does not print seeds and is gated
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

import {
  evaluateProvisioningOp,
  __policyInternals,
} from "@/lib/troptions/asset-provisioning/assetProvisioningPolicyEngine";
import type {
  ProvisioningOpDescriptor,
  ProvisioningApprovalContext,
} from "@/lib/troptions/asset-provisioning/assetProvisioningTypes";

const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

const trustSetOp: ProvisioningOpDescriptor = {
  id: "test.trustset",
  chain: "xrpl",
  kind: "TrustSet",
  account: "rTEST00000000000000000000000000000",
  summary: "test trustset",
  params: {},
};

describe("assetProvisioningPolicyEngine", () => {
  it("returns allowed-dry-run when execute flag is absent", () => {
    const ctx: ProvisioningApprovalContext = { executeFlag: false };
    const d = evaluateProvisioningOp(trustSetOp, ctx);
    expect(d.outcome).toBe("allowed-dry-run");
  });

  it("blocks live writes without approvals", () => {
    const ctx: ProvisioningApprovalContext = { executeFlag: true, network: "testnet" };
    const d = evaluateProvisioningOp(trustSetOp, ctx);
    expect(d.outcome).toBe("blocked");
    expect(d.missingApprovals.length).toBeGreaterThan(0);
  });

  it("blocks mainnet unconditionally (current policy)", () => {
    const ctx: ProvisioningApprovalContext = {
      executeFlag: true,
      network: "mainnet",
      executeEnvAck: "YES_I_UNDERSTAND",
      controlHubApprovalId: "ch-1",
      legalReviewId: "lg-1",
      custodyReviewId: "cu-1",
      complianceReviewId: "cm-1",
    };
    const d = evaluateProvisioningOp(trustSetOp, ctx);
    expect(d.outcome).toBe("blocked");
    expect(d.reasons.some((r) => /mainnet/i.test(r))).toBe(true);
  });

  it("allows testnet write when all approvals present", () => {
    const ctx: ProvisioningApprovalContext = {
      executeFlag: true,
      network: "testnet",
      executeEnvAck: "YES_I_UNDERSTAND",
      controlHubApprovalId: "ch-1",
      legalReviewId: "lg-1",
      custodyReviewId: "cu-1",
      complianceReviewId: "cm-1",
    };
    const d = evaluateProvisioningOp(trustSetOp, ctx);
    expect(d.outcome).toBe("allowed-with-approval");
  });

  it("treats every live-write kind as gated", () => {
    const expected = [
      "AccountSet", "TrustSet", "Payment", "NFTokenMint", "MPTokenIssuanceCreate",
      "OfferCreate", "SetOptions", "ChangeTrust", "SetTrustLineFlags",
      "ManageSellOffer", "ManageBuyOffer",
    ];
    expect([...__policyInternals.LIVE_WRITE_KINDS].sort()).toEqual([...expected].sort());
  });
});

describe("metadata files", () => {
  const files = [
    "public/.well-known/stellar.toml",
    "public/.well-known/xrp-ledger.toml",
    "public/troptions/asset-metadata/troptions.iou.v1.json",
    "public/troptions/asset-metadata/troptions.nft.collection.v1.json",
    "public/troptions/asset-metadata/troptions.mpt.tranche-a.v1.json",
  ];
  it.each(files)("exists: %s", (rel) => {
    expect(fs.existsSync(path.join(REPO_ROOT, rel))).toBe(true);
  });

  const banned = [
    /\bguaranteed\s+(value|returns?|redemption|profits?|yields?|payouts?|interest|dividends?)\b/i,
    /\bredeemable\s+for\s+cash\b/i,
    /\brisk[-\s]?free\b/i,
    /\bpassive\s+income\b/i,
    /\bearn\s+(?:yield|returns?|profits?|interest|rewards|passive)\b/i,
    /\binvestment\s+(?:opportunity|vehicle|product)\b/i,
    /\bAPY\b/,
    /\bAPR\b/,
  ];
  const NEG = /(?:\bnot\b|\bno\b|\bnever\b|\bnon-\b|\bwithout\b|\bdoes not\b|\bdo not\b|\bdoesn't\b|\bdon't\b|"\s*:\s*false|=\s*false|\bdisclaim|\bare not\b|\bis not\b|\bany\s+guaranteed\b)/i;
  it.each(files)("contains no positively-framed banned claims: %s", (rel) => {
    const txt = fs.readFileSync(path.join(REPO_ROOT, rel), "utf8");
    const phrases = txt.split(/[\n.,;:!?]+/);
    for (const raw of phrases) {
      const phrase = raw.trim();
      if (!phrase) continue;
      for (const rx of banned) {
        if (rx.test(phrase) && !NEG.test(phrase)) {
          throw new Error(`Banned claim ${rx} in non-negated phrase: "${phrase.slice(0, 120)}"`);
        }
      }
    }
  });

  it("JSON metadata parses and includes legal notice", () => {
    for (const rel of files.filter((f) => f.endsWith(".json"))) {
      const j = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, rel), "utf8"));
      expect(j.compliance).toBeDefined();
      expect(typeof j.compliance.legalNotice).toBe("string");
      expect(j.compliance.legalNotice.length).toBeGreaterThan(20);
    }
  });
});

describe("provision script safety", () => {
  it("defaults to dry-run (no execute flag, no network calls)", () => {
    const r = spawnSync(
      process.execPath,
      ["scripts/provision-troptions-assets.mjs", "--metadata-only"],
      { cwd: REPO_ROOT, encoding: "utf8", timeout: 30000 },
    );
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/DRY-RUN|metadata-only/i);
    // never prints seed material — sanity check on common XRPL/Stellar seed prefixes.
    expect(r.stdout).not.toMatch(/\bs[A-HJ-NP-Z1-9]{28,}\b/); // XRPL seed (base58, starts with 's')
    expect(r.stdout).not.toMatch(/\bS[A-Z2-7]{55}\b/);        // Stellar secret (base32, 56 chars, starts with 'S')
  });

  it("--execute without approvals is blocked with exit code 2", () => {
    const env = { ...process.env };
    delete env.TROPTIONS_PROVISIONING_EXECUTE;
    delete env.TROPTIONS_CONTROL_HUB_APPROVAL_ID;
    delete env.TROPTIONS_LEGAL_REVIEW_ID;
    delete env.TROPTIONS_CUSTODY_REVIEW_ID;
    const r = spawnSync(
      process.execPath,
      ["scripts/provision-troptions-assets.mjs", "--execute", "--network=testnet"],
      { cwd: REPO_ROOT, encoding: "utf8", timeout: 30000, env },
    );
    expect(r.status).toBe(2);
    expect(r.stdout + r.stderr).toMatch(/EXECUTION BLOCKED|approval gates/i);
  });

  it("validate-troptions-asset-metadata.mjs passes", () => {
    const r = spawnSync(
      process.execPath,
      ["scripts/validate-troptions-asset-metadata.mjs"],
      { cwd: REPO_ROOT, encoding: "utf8", timeout: 30000 },
    );
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/All metadata checks passed/);
  });
});
