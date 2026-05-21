import type { WalletForensicsWalletRecord } from "@/content/troptions/walletForensicsRegistry";

// ── TROPTIONS XRPL Wallets ────────────────────────────────────────────────────
// These are the live TROPTIONS wallets deployed on XRPL mainnet 2026-04-28.
// All wallets are TROPTIONS-specific only. No legacy token or UnyKorn entries.
//
// Token: TROPTIONS IOU
// Issuer: rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ
// Supply: 100,000,000 TROPTIONS
// Price: $0.0114 | Market Cap: $1.1M | AMM TVL: $7.91

export const XRPL_WALLET_INVENTORY_REGISTRY: readonly WalletForensicsWalletRecord[] = [

  // ── TROPTIONS Issuer (Cold — master key, issues all TROPTIONS tokens) ──────
  {
    walletId: "xrpl-troptions-issuer",
    address: "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ",
    chain: "xrpl",
    label: "TROPTIONS Issuer (Cold)",
    source: "TROPTIONS mainnet deployment — 2026-04-28",
    role: "iou-issuer",
    firstSeen: "2026-04-28T08:34:51Z",
    lastSeen: "2026-04-28T08:35:00Z",
    currentBalance: "3 XRP funded",
    reserve: "1 XRP base reserve",
    availableBalance: "~1 XRP spendable",
    masterKeyStatus: "enabled",
    signingKeySeen: true,
    riskStatus: "low",
    notes: [
      "TROPTIONS IOU issuer — all 100,000,000 TROPTIONS tokens originated from this address.",
      "Funded with 3 XRP on 2026-04-28. Issued 100M TROPTIONS to distribution wallet.",
      "Issuer accounts must NOT hold trustlines to their own token.",
      "Keep master key cold. Never fund to AMM or DEX directly.",
    ],
    explorerLinks: [
      { label: "XRPSCAN", url: "https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ" },
      { label: "XRPL Explorer", url: "https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ" },
      { label: "XRPL Token Info", url: "https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ" },
    ],
  },

  // ── TROPTIONS Distribution + AMM (Warm — DEX maker, AMM LP) ──────────────
  {
    walletId: "xrpl-troptions-distribution-amm",
    address: "rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt",
    chain: "xrpl",
    label: "TROPTIONS Distribution + AMM (Warm)",
    source: "TROPTIONS mainnet deployment — 2026-04-28",
    role: "treasury",
    firstSeen: "2026-04-28T08:34:51Z",
    lastSeen: "2026-04-28T08:35:40Z",
    currentBalance: "5 XRP funded + 100M TROPTIONS received",
    reserve: "1 XRP base + trustline reserves",
    availableBalance: "~3 XRP spendable",
    masterKeyStatus: "enabled",
    signingKeySeen: true,
    riskStatus: "low",
    notes: [
      "Received 100,000,000 TROPTIONS from issuer on 2026-04-28T08:35:00Z.",
      "Created TROPTIONS/XRP AMM pool — TVL $7.91 at launch.",
      "Initial DEX offers placed at 10,000 XRP/TROPTIONS price.",
      "Also handles distribution trustlines and holder onboarding.",
      "Funded with 5 XRP on 2026-04-28.",
    ],
    explorerLinks: [
      { label: "XRPSCAN", url: "https://xrpscan.com/account/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt" },
      { label: "XRPL Explorer", url: "https://xrpscan.com/account/rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt" },
    ],
  },

  // NOTE: Independent third-party DEX traders and trustline holders observed
  // on chain (rsRy4Yic..., rMbHoVjLF2z3bS6Pg4NJcqoMsjyExn5LVu,
  // r49zYHBsv1WJU6yXV4s2jm5YJDLGT1JFT5) are deliberately excluded from this
  // inventory. Only Troptions-controlled wallets are listed here.
];

// -- Convenience lookups ─────────────────────────────────────────────────────
export const XRPL_ALL_ADDRESSES = XRPL_WALLET_INVENTORY_REGISTRY.map((w) => w.address);

// These are empty in the TROPTIONS-only registry — no compromised wallets.
export const XRPL_HIGH_RISK_ADDRESSES: readonly string[] = [];
export const XRPL_SIGNING_KEY_ADDRESSES: readonly string[] = [];
