// TROPTIONS Exchange OS — Prepare Token Launch Transactions
// Returns unsigned AccountSet + TrustSet blobs for issuer to sign.
// Mainnet execution requires XRPL_MAINNET_ENABLED=true + wallet signing.

import { xrplConfig } from "@/config/exchange-os/xrpl";
import type { UnsignedXrplTransaction } from "./types";

export interface LaunchRequest {
  issuerWallet: string;
  currency: string;
  maxSupply: string;
  transferFee?: number; // 0–50000 (50000 = 50%)
  freezeEnabled?: boolean;
  clawbackEnabled?: boolean;
  requireDestinationTag?: boolean;
  metadataUrl?: string;
  initialLiquidityXrp?: string;
  initialLiquidityToken?: string;
  launchWithAmm?: boolean;
}

export interface LaunchPacket {
  step: string;
  transactions: UnsignedXrplTransaction[];
  instructions: string[];
  warnings: string[];
  demoMode: boolean;
}

/** Build unsigned launch transaction sequence for review */
export function prepareXrplLaunch(req: LaunchRequest): LaunchPacket {
  const networkId = xrplConfig.mainnetEnabled ? 0 : 1;
  const networkName = xrplConfig.mainnetEnabled ? "mainnet" : "testnet";
  const expiresAt = new Date(
    Date.now() + xrplConfig.unsignedTxTtlSecs * 1_000
  ).toISOString();

  const baseTx = {
    networkId,
    networkName,
    expiresAt,
    demoMode: xrplConfig.demoMode,
    signingNote:
      "Sign each transaction in order with your issuer wallet. " +
      "TROPTIONS never holds your keys.",
  } as const;

  // Step 1: AccountSet — configure issuer controls
  let accountFlags = 0;
  if (!req.freezeEnabled) accountFlags |= 0x00200000; // lsfNoFreeze
  if (req.clawbackEnabled) accountFlags |= 0x80000000; // lsfAllowTrustLineClawback
  if (req.requireDestinationTag) accountFlags |= 0x00020000; // lsfRequireDestTag

  const accountSetTx: Record<string, unknown> = {
    TransactionType: "AccountSet",
    Account: req.issuerWallet,
    SetFlag: accountFlags > 0 ? accountFlags : undefined,
    Domain: req.metadataUrl
      ? Buffer.from(req.metadataUrl, "utf-8").toString("hex").toUpperCase()
      : undefined,
    TransferRate: req.transferFee ? 1_000_000_000 + req.transferFee : undefined,
  };

  const accountSetUnsigned: UnsignedXrplTransaction = {
    ...baseTx,
    txBlob: accountSetTx,
    txType: "AccountSet",
  };

  const transactions = [accountSetUnsigned];

  // Step 2: AMMCreate if launching with liquidity pool
  if (req.launchWithAmm && req.initialLiquidityXrp && req.initialLiquidityToken) {
    const ammCreateTx: Record<string, unknown> = {
      TransactionType: "AMMCreate",
      Account: req.issuerWallet,
      Amount: String(
        Math.round(parseFloat(req.initialLiquidityXrp) * 1_000_000)
      ),
      Amount2: {
        currency: req.currency,
        issuer: req.issuerWallet,
        value: req.initialLiquidityToken,
      },
      TradingFee: 300, // 0.3%
    };
    transactions.push({
      ...baseTx,
      txBlob: ammCreateTx,
      txType: "AMMCreate",
    });
  }

  const warnings: string[] = [
    "This is a launch packet. Real mainnet execution requires XRPL_MAINNET_ENABLED=true.",
    "Sign each transaction ONLY with the issuer wallet you control.",
    "Token launches on mainnet are permanent. Review all settings carefully.",
  ];

  if (req.clawbackEnabled) {
    warnings.push(
      "CLAWBACK ENABLED: You can recover tokens from any holder. " +
      "This is a significant power that affects user trust. Disclose this clearly."
    );
  }

  if (req.freezeEnabled) {
    warnings.push(
      "FREEZE ENABLED: You can freeze token transfers for any account. " +
      "Disclose this clearly to your users."
    );
  }

  return {
    step: "launch-packet",
    transactions,
    instructions: [
      "1. Review all settings and risk labels in the Review tab.",
      "2. Download this launch packet JSON.",
      "3. Sign AccountSet transaction with your issuer wallet.",
      "4. If launching with AMM, sign AMMCreate transaction after AccountSet confirms.",
      "5. Publish your token page and proof packet.",
    ],
    warnings,
    demoMode: xrplConfig.demoMode,
  };
}
