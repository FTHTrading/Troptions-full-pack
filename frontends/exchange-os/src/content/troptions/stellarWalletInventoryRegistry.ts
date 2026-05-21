import type { WalletForensicsWalletRecord } from "@/content/troptions/walletForensicsRegistry";

// ── TROPTIONS Stellar Wallets ─────────────────────────────────────────────────
// These are the live TROPTIONS wallets funded on Stellar mainnet 2026-04-28.
// TROPTIONS-specific only. No legacy token or UnyKorn entries.
//
// Both wallets confirmed funded and recorded in data/treasury-funding-log.json.

export const STELLAR_WALLET_INVENTORY_REGISTRY: readonly WalletForensicsWalletRecord[] = [
  {
    walletId: "stellar-troptions-issuer",
    address: "GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4",
    chain: "stellar",
    label: "TROPTIONS Stellar Issuer",
    source: "TROPTIONS mainnet deployment — 2026-04-28. Funded via treasury-funding-log.json (ledger 62321764, 5 XLM)",
    role: "issuer",
    firstSeen: "2026-04-28T00:00:00Z",
    lastSeen: "2026-04-28T00:00:00Z",
    currentBalance: "5 XLM",
    masterKeyStatus: "enabled",
    signingKeySeen: true,
    riskStatus: "low",
    notes: [
      "TROPTIONS Stellar issuer — funded 5 XLM on 2026-04-28 (ledger 62321764).",
      "This account is the master authority for issuing TROPTIONS on Stellar mainnet.",
      "Keep signer threshold high. Enable AUTH_REQUIRED for trustline control.",
      "Do NOT fund this account with large amounts — it is a cold issuer.",
    ],
    explorerLinks: [
      {
        label: "Stellar Expert",
        url: "https://stellar.expert/explorer/public/account/GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4",
      },
      {
        label: "Stellarchain",
        url: "https://stellarchain.io/accounts/GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4",
      },
    ],
  },

  {
    walletId: "stellar-troptions-distribution",
    address: "GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC",
    chain: "stellar",
    label: "TROPTIONS Stellar Distribution",
    source: "TROPTIONS mainnet deployment — 2026-04-28. Funded via treasury-funding-log.json (ledger 62321765, 15 XLM)",
    role: "treasury",
    firstSeen: "2026-04-28T00:00:00Z",
    lastSeen: "2026-04-28T00:00:00Z",
    currentBalance: "15 XLM",
    masterKeyStatus: "enabled",
    signingKeySeen: true,
    riskStatus: "low",
    notes: [
      "TROPTIONS Stellar distribution wallet — funded 15 XLM on 2026-04-28 (ledger 62321765).",
      "Holds issued TROPTIONS for controlled release via the Stellar AMM and direct trustlines.",
      "More XLM funded here (15 vs 5) to cover trustline reserves and AMM pool seeding.",
      "Monitor for large outflows or unauthorised signer additions.",
    ],
    explorerLinks: [
      {
        label: "Stellar Expert",
        url: "https://stellar.expert/explorer/public/account/GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC",
      },
      {
        label: "Stellarchain",
        url: "https://stellarchain.io/accounts/GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC",
      },
    ],
  },
];

export const STELLAR_ALL_ADDRESSES = STELLAR_WALLET_INVENTORY_REGISTRY.map((w) => w.address);
