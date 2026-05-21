/**
 * Wallet Address Resolver
 * ─────────────────────────────────────────────────────────────────────────────
 * SERVER-SIDE ONLY. Resolves runtime wallet addresses from env seeds/secrets.
 *
 * Bridges the gap between internal wallet IDs and live on-chain addresses,
 * so the portal and dashboard can display real addresses derived from env.
 *
 * Never returns seeds, secrets, or private keys.
 */

import { getXrplWalletAddresses } from "./xrplLedgerEngine";
import { getStellarWalletAddresses } from "./stellarLedgerEngine";
import { POLYGON_KNOWN_TOKENS } from "./polygonWalletEngine";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ResolvedChainAddress {
  chain:   string;
  role:    string;
  address: string;
  format:  "xrpl" | "stellar" | "evm" | "internal";
}

export interface ResolvedWalletAddresses {
  walletId:  string;
  chains:    ResolvedChainAddress[];
  resolvedAt: string;
}

// ─── Resolver ────────────────────────────────────────────────────────────────

/**
 * Resolve all live on-chain addresses for a wallet.
 * Address derivation happens here at runtime — no addresses are hard-coded.
 *
 * Currently maps all wallets to the shared TROPTIONS operational addresses
 * (distributor for receives, treasury for reads).
 * Future: per-wallet HD derivation paths.
 */
export function resolveWalletAddresses(walletId: string): ResolvedWalletAddresses {
  const xrpl    = getXrplWalletAddresses();
  const stellar = getStellarWalletAddresses();

  const chains: ResolvedChainAddress[] = [];

  // XRPL — public receive address is the distributor
  if (xrpl.distributor) {
    chains.push({ chain: "xrpl", role: "distributor", address: xrpl.distributor, format: "xrpl" });
  }
  if (xrpl.issuer) {
    chains.push({ chain: "xrpl", role: "issuer", address: xrpl.issuer, format: "xrpl" });
  }
  if (xrpl.treasury) {
    chains.push({ chain: "xrpl", role: "treasury", address: xrpl.treasury, format: "xrpl" });
  }
  if (xrpl.nftIssuer) {
    chains.push({ chain: "xrpl", role: "nft-issuer", address: xrpl.nftIssuer, format: "xrpl" });
  }
  if (xrpl.dexMaker) {
    chains.push({ chain: "xrpl", role: "dex-maker", address: xrpl.dexMaker, format: "xrpl" });
  }
  if (xrpl.ammLp) {
    chains.push({ chain: "xrpl", role: "amm-lp", address: xrpl.ammLp, format: "xrpl" });
  }

  // Stellar — distributor is the public receive address
  if (stellar.distributor) {
    chains.push({ chain: "stellar", role: "distributor", address: stellar.distributor, format: "stellar" });
  }
  if (stellar.issuer) {
    chains.push({ chain: "stellar", role: "issuer", address: stellar.issuer, format: "stellar" });
  }
  if (stellar.lp) {
    chains.push({ chain: "stellar", role: "lp", address: stellar.lp, format: "stellar" });
  }
  if (stellar.anchor) {
    chains.push({ chain: "stellar", role: "anchor", address: stellar.anchor, format: "stellar" });
  }

  // Polygon — token contract addresses (constant, no env derivation needed)
  chains.push({ chain: "polygon", role: "kenny-token", address: POLYGON_KNOWN_TOKENS.KENNY.address, format: "evm" });
  chains.push({ chain: "polygon", role: "evl-token",   address: POLYGON_KNOWN_TOKENS.EVL.address,   format: "evm" });

  return {
    walletId,
    chains,
    resolvedAt: new Date().toISOString(),
  };
}

/**
 * Resolve the primary receive address for a given chain.
 * Returns null if no address is configured in env.
 */
export function getReceiveAddress(chain: "xrpl" | "stellar" | "polygon"): string | null {
  switch (chain) {
    case "xrpl": {
      const { distributor } = getXrplWalletAddresses();
      return distributor;
    }
    case "stellar": {
      const { distributor } = getStellarWalletAddresses();
      return distributor;
    }
    case "polygon":
      // Polygon receive address must be set explicitly via env; no derivation
      return process.env.POLYGON_RECEIVE_ADDRESS ?? null;
  }
}

/**
 * Summarise which chains have configured addresses (for health/status pages).
 */
export function getAddressResolutionStatus(): Record<string, { configured: boolean; role?: string }> {
  const xrpl    = getXrplWalletAddresses();
  const stellar = getStellarWalletAddresses();
  return {
    "xrpl-issuer":         { configured: !!xrpl.issuer,         role: "issuer"       },
    "xrpl-distributor":    { configured: !!xrpl.distributor,    role: "distributor"  },
    "xrpl-treasury":       { configured: !!xrpl.treasury,       role: "treasury"     },
    "xrpl-nft-issuer":     { configured: !!xrpl.nftIssuer,      role: "nft-issuer"   },
    "xrpl-dex-maker":      { configured: !!xrpl.dexMaker,       role: "dex-maker"    },
    "xrpl-amm-lp":         { configured: !!xrpl.ammLp,          role: "amm-lp"       },
    "stellar-issuer":      { configured: !!stellar.issuer,      role: "issuer"       },
    "stellar-distributor": { configured: !!stellar.distributor, role: "distributor"  },
    "stellar-lp":          { configured: !!stellar.lp,          role: "lp"           },
    "stellar-anchor":      { configured: !!stellar.anchor,      role: "anchor"       },
    "polygon-receive":     { configured: !!process.env.POLYGON_RECEIVE_ADDRESS, role: "receive" },
  };
}
