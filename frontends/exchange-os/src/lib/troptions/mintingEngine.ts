/**
 * Troptions Minting Engine
 *
 * Handles tradeline (trustline), NFT, and LP token creation on XRPL and Stellar.
 * Controlled via env flags:
 *   TROPTIONS_XRPL_MINT_MODE=simulation|live   (default: simulation)
 *   TROPTIONS_STELLAR_MINT_MODE=simulation|live (default: simulation)
 *
 * SECURITY: Seeds are read from env vars only. Never logged.
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export type MintMode = "simulation" | "live";
export type MintChain = "xrpl" | "stellar";

// ─── MPT (Multi-Purpose Token — XLS-33) ───────────────────────────────────────
export interface MptMintRequest {
  /** Human name / label — stored in hex metadata */
  name: string;
  /** Ticker symbol, e.g. "TROPT" */
  ticker: string;
  /** Total maximum supply (integer string, up to 9223372036854775807) */
  maxSupply: string;
  /** Decimal precision 0-15 (like ERC-20 decimals) */
  assetScale?: number;
  /** Transfer fee 0-50000 bps */
  transferFee?: number;
  /** Allow peer-to-peer transfers */
  transferable?: boolean;
  /** Allow trading on DEX */
  tradeable?: boolean;
  /** Allow issuer clawback */
  clawback?: boolean;
}

// ─── Wallet Funding (Payment from treasury) ───────────────────────────────────
export interface WalletFundRequest {
  /** Destination XRPL address */
  toAddress: string;
  /** Amount in XRP (not drops) */
  amountXrp: string;
  /** Optional memo */
  memo?: string;
}

// ─── AMM Deposit (add liquidity to existing pool) ────────────────────────────
export interface AmmDepositRequest {
  /** First asset */
  asset1: XrplAmount;
  /** Second asset */
  asset2: XrplAmount;
  /** LP token amount to target — leave blank for single-sided or proportional */
  lpTokenAmount?: string;
  /** Asset 1 amount to deposit */
  amount1?: string;
  /** Asset 2 amount to deposit (omit for single-sided) */
  amount2?: string;
}

export interface TradelineMintRequest {
  chain: MintChain;
  /** Asset code, e.g. "TROPT" or "GOLD" */
  assetCode: string;
  /** Issuer address (for the trust line target) */
  issuerAddress: string;
  /** Maximum trust amount as string-number */
  limitAmount: string;
  /** Optional memo / label */
  memo?: string;
}

export interface NftMintRequest {
  /** Human-readable name for the NFT */
  name: string;
  /** URI metadata pointer (IPFS, HTTPS, etc.) */
  uri: string;
  /** NFToken taxon (collection grouping) */
  taxon: number;
  /** Transfer fee in basis points 0-50000 (0 = non-transferable for free) */
  transferFee?: number;
  /** Whether the NFT can be transferred */
  transferable?: boolean;
  /** Whether the NFT can be burned by the issuer */
  burnable?: boolean;
  /** Optional memo */
  memo?: string;
}

export interface LpTokenRequest {
  chain: MintChain;
  /** First asset: { currency: "XRP" } or { currency: "TROPT", issuer: "..." } */
  asset1: XrplAmount;
  /** Second asset */
  asset2: XrplAmount;
  /** Initial liquidity for asset1 */
  amount1: string;
  /** Initial liquidity for asset2 */
  amount2: string;
  /** AMM trading fee in basis points (0-1000 = 0%-1%) */
  tradingFee?: number;
}

export interface XrplAmount {
  currency: string;
  issuer?: string;
}

export interface MintResult {
  ok: boolean;
  mode: MintMode;
  chain: MintChain;
  txHash?: string;
  txType?: string;
  ledgerIndex?: number;
  simulatedData?: Record<string, unknown>;
  error?: string;
  timestamp: string;
}

// ─── Mode helpers ──────────────────────────────────────────────────────────────

function getXrplMode(): MintMode {
  const v = process.env.TROPTIONS_XRPL_MINT_MODE;
  return v === "live" ? "live" : "simulation";
}

function getStellarMode(): MintMode {
  const v = process.env.TROPTIONS_STELLAR_MINT_MODE;
  return v === "live" ? "live" : "simulation";
}

// ─── Simulation results ────────────────────────────────────────────────────────

function simulateTradeline(req: TradelineMintRequest): MintResult {
  return {
    ok: true,
    mode: "simulation",
    chain: req.chain,
    txType: req.chain === "xrpl" ? "TrustSet" : "changeTrust",
    simulatedData: {
      action: "Set trustline",
      assetCode: req.assetCode,
      issuer: req.issuerAddress,
      limitAmount: req.limitAmount,
      memo: req.memo ?? null,
      note: "Simulation mode — no mainnet transaction submitted.",
    },
    timestamp: new Date().toISOString(),
  };
}

function simulateNft(req: NftMintRequest): MintResult {
  return {
    ok: true,
    mode: "simulation",
    chain: "xrpl",
    txType: "NFTokenMint",
    simulatedData: {
      action: "Mint NFT",
      name: req.name,
      uri: Buffer.from(req.uri).toString("hex").toUpperCase(),
      taxon: req.taxon,
      transferFee: req.transferFee ?? 0,
      flags:
        (req.transferable !== false ? 8 : 0) | (req.burnable ? 1 : 0),
      note: "Simulation mode — no mainnet transaction submitted.",
    },
    timestamp: new Date().toISOString(),
  };
}

function simulateLp(req: LpTokenRequest): MintResult {
  return {
    ok: true,
    mode: "simulation",
    chain: req.chain,
    txType: req.chain === "xrpl" ? "AMMCreate" : "joinLiquidityPool",
    simulatedData: {
      action: "Create LP pool",
      asset1: req.asset1,
      asset2: req.asset2,
      amount1: req.amount1,
      amount2: req.amount2,
      tradingFee: req.tradingFee ?? 0,
      note: "Simulation mode — no mainnet transaction submitted.",
    },
    timestamp: new Date().toISOString(),
  };
}

// ─── Live XRPL helpers ────────────────────────────────────────────────────────

async function getXrplClient() {
  const { Client } = await import("xrpl");
  const node = process.env.XRPL_NODE ?? "wss://xrplcluster.com";
  const client = new Client(node);
  await client.connect();
  return client;
}

function getXrplWallet() {
  const { Wallet } = require("xrpl") as typeof import("xrpl");
  const seed = process.env.XRPL_TREASURY_SEED;
  if (!seed) throw new Error("XRPL_TREASURY_SEED not set");
  return Wallet.fromSeed(seed);
}

// ─── Live Stellar helpers ─────────────────────────────────────────────────────

async function getStellarAccount() {
  const sdk = await import("@stellar/stellar-sdk");
  const horizonUrl =
    process.env.STELLAR_HORIZON_URL ?? "https://horizon.stellar.org";
  const server = new sdk.Horizon.Server(horizonUrl);
  const secret = process.env.STELLAR_TREASURY_SECRET;
  if (!secret) throw new Error("STELLAR_TREASURY_SECRET not set");
  const keypair = sdk.Keypair.fromSecret(secret);
  const account = await server.loadAccount(keypair.publicKey());
  return { sdk, server, keypair, account };
}

// ─── Tradeline Minting ────────────────────────────────────────────────────────

export async function mintTradeline(req: TradelineMintRequest): Promise<MintResult> {
  const mode = req.chain === "xrpl" ? getXrplMode() : getStellarMode();

  if (mode === "simulation") return simulateTradeline(req);

  if (req.chain === "xrpl") {
    const client = await getXrplClient();
    try {
      const xrpl = require("xrpl") as typeof import("xrpl");
      const wallet = getXrplWallet();
      const tx: import("xrpl").TrustSet = {
        TransactionType: "TrustSet",
        Account: wallet.address,
        LimitAmount: {
          currency: req.assetCode,
          issuer: req.issuerAddress,
          value: req.limitAmount,
        },
      };
      if (req.memo) {
        tx.Memos = [
          {
            Memo: {
              MemoData: Buffer.from(req.memo, "utf8").toString("hex").toUpperCase(),
            },
          },
        ];
      }
      const prepared = await client.autofill(tx);
      const signed = wallet.sign(prepared);
      const result = await client.submitAndWait(signed.tx_blob);
      return {
        ok: result.result.meta !== "string" &&
          (result.result.meta as { TransactionResult?: string })?.TransactionResult === "tesSUCCESS",
        mode: "live",
        chain: "xrpl",
        txHash: signed.hash,
        txType: "TrustSet",
        ledgerIndex:
          typeof result.result.ledger_index === "number"
            ? result.result.ledger_index
            : undefined,
        timestamp: new Date().toISOString(),
      };
    } finally {
      await client.disconnect();
    }
  }

  // Stellar live
  const { sdk, server, keypair, account } = await getStellarAccount();
  const asset = new sdk.Asset(req.assetCode, req.issuerAddress);
  const txBuilder = new sdk.TransactionBuilder(account, {
    fee: sdk.BASE_FEE,
    networkPassphrase: sdk.Networks.PUBLIC,
  });
  txBuilder.addOperation(
    sdk.Operation.changeTrust({ asset, limit: req.limitAmount })
  );
  if (req.memo) txBuilder.addMemo(sdk.Memo.text(req.memo.slice(0, 28)));
  txBuilder.setTimeout(30);
  const tx = txBuilder.build();
  tx.sign(keypair);
  const submitResp = await server.submitTransaction(tx);
  return {
    ok: submitResp.successful,
    mode: "live",
    chain: "stellar",
    txHash: submitResp.hash,
    txType: "changeTrust",
    timestamp: new Date().toISOString(),
  };
}

// ─── NFT Minting ──────────────────────────────────────────────────────────────

export async function mintNft(req: NftMintRequest): Promise<MintResult> {
  const mode = getXrplMode();
  if (mode === "simulation") return simulateNft(req);

  const client = await getXrplClient();
  try {
    const xrpl = require("xrpl") as typeof import("xrpl");
    const wallet = getXrplWallet();
    const uriHex = Buffer.from(req.uri, "utf8").toString("hex").toUpperCase();

    // NFTokenMint flags: tfTransferable=8, tfBurnable=1, tfOnlyXRP=2
    let flags = 0;
    if (req.transferable !== false) flags |= 8; // transferable by default
    if (req.burnable) flags |= 1;

    const tx: import("xrpl").NFTokenMint = {
      TransactionType: "NFTokenMint",
      Account: wallet.address,
      NFTokenTaxon: req.taxon,
      Flags: flags,
      URI: uriHex,
    };
    if (req.transferFee && req.transferFee > 0) {
      tx.TransferFee = req.transferFee;
    }
    if (req.memo) {
      tx.Memos = [
        {
          Memo: {
            MemoData: Buffer.from(req.memo, "utf8").toString("hex").toUpperCase(),
          },
        },
      ];
    }

    const prepared = await client.autofill(tx);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    const meta = result.result.meta as {
      TransactionResult?: string;
      nftoken_id?: string;
    } | undefined;

    return {
      ok: meta?.TransactionResult === "tesSUCCESS",
      mode: "live",
      chain: "xrpl",
      txHash: signed.hash,
      txType: "NFTokenMint",
      ledgerIndex:
        typeof result.result.ledger_index === "number"
          ? result.result.ledger_index
          : undefined,
      simulatedData: meta?.nftoken_id ? { nftokenId: meta.nftoken_id } : undefined,
      timestamp: new Date().toISOString(),
    };
  } finally {
    await client.disconnect();
  }
}

// ─── LP Token Creation ────────────────────────────────────────────────────────

export async function createLpToken(req: LpTokenRequest): Promise<MintResult> {
  const mode = req.chain === "xrpl" ? getXrplMode() : getStellarMode();
  if (mode === "simulation") return simulateLp(req);

  if (req.chain === "xrpl") {
    // XRPL AMMCreate
    const client = await getXrplClient();
    try {
      const wallet = getXrplWallet();

      const buildXrplAmt = (asset: XrplAmount, amount: string): import("xrpl").IssuedCurrencyAmount | string => {
        if (asset.currency === "XRP") {
          // convert XRP to drops
          return String(Math.floor(parseFloat(amount) * 1_000_000));
        }
        return { currency: asset.currency, issuer: asset.issuer!, value: amount };
      };

      const tx: import("xrpl").AMMCreate = {
        TransactionType: "AMMCreate",
        Account: wallet.address,
        Amount: buildXrplAmt(req.asset1, req.amount1),
        Amount2: buildXrplAmt(req.asset2, req.amount2),
        TradingFee: req.tradingFee ?? 0,
      };

      const prepared = await client.autofill(tx);
      const signed = wallet.sign(prepared);
      const result = await client.submitAndWait(signed.tx_blob);
      const meta = result.result.meta as { TransactionResult?: string } | undefined;

      return {
        ok: meta?.TransactionResult === "tesSUCCESS",
        mode: "live",
        chain: "xrpl",
        txHash: signed.hash,
        txType: "AMMCreate",
        ledgerIndex:
          typeof result.result.ledger_index === "number"
            ? result.result.ledger_index
            : undefined,
        timestamp: new Date().toISOString(),
      };
    } finally {
      await client.disconnect();
    }
  }

  // Stellar liquidity pool
  const { sdk, server, keypair, account } = await getStellarAccount();
  const stellarAsset1 =
    req.asset1.currency === "native"
      ? sdk.Asset.native()
      : new sdk.Asset(req.asset1.currency, req.asset1.issuer);
  const stellarAsset2 =
    req.asset2.currency === "native"
      ? sdk.Asset.native()
      : new sdk.Asset(req.asset2.currency, req.asset2.issuer);

  const fee = req.tradingFee ?? sdk.LiquidityPoolFeeV18;
  const lpAsset = new sdk.LiquidityPoolAsset(stellarAsset1, stellarAsset2, fee);
  const poolId = sdk
    .getLiquidityPoolId("constant_product", lpAsset.getLiquidityPoolParameters())
    .toString("hex");

  const txBuilder = new sdk.TransactionBuilder(account, {
    fee: sdk.BASE_FEE,
    networkPassphrase: sdk.Networks.PUBLIC,
  });
  // Establish trust on the LP share token, then deposit
  txBuilder.addOperation(sdk.Operation.changeTrust({ asset: lpAsset, limit: "1000000000" }));
  txBuilder.addOperation(
    sdk.Operation.liquidityPoolDeposit({
      liquidityPoolId: poolId,
      maxAmountA: req.amount1,
      maxAmountB: req.amount2,
      minPrice: { n: 1, d: 10 },
      maxPrice: { n: 10, d: 1 },
    })
  );
  txBuilder.setTimeout(30);
  const tx = txBuilder.build();
  tx.sign(keypair);
  const submitResp = await server.submitTransaction(tx);
  return {
    ok: submitResp.successful,
    mode: "live",
    chain: "stellar",
    txHash: submitResp.hash,
    txType: "liquidityPoolDeposit",
    timestamp: new Date().toISOString(),
  };
}

// ─── MPT Issuance (XLS-33 Multi-Purpose Token) ────────────────────────────────

function buildMptMetadataHex(name: string, ticker: string): string {
  const meta = JSON.stringify({ name, ticker, issuer: "Troptions", version: "1" });
  return Buffer.from(meta, "utf8").toString("hex").toUpperCase();
}

function simulateMpt(req: MptMintRequest): MintResult {
  return {
    ok: true,
    mode: "simulation",
    chain: "xrpl",
    txType: "MPTokenIssuanceCreate",
    simulatedData: {
      action: "Create MPT issuance",
      name: req.name,
      ticker: req.ticker,
      maxSupply: req.maxSupply,
      assetScale: req.assetScale ?? 6,
      transferFee: req.transferFee ?? 0,
      flags:
        (req.transferable !== false ? 32 : 0) |  // tfMPTCanTransfer
        (req.tradeable !== false ? 16 : 0) |      // tfMPTCanTrade
        (req.clawback ? 64 : 0),                  // tfMPTCanClawback
      metadataHex: buildMptMetadataHex(req.name, req.ticker),
      note: "Simulation mode — no mainnet transaction submitted.",
    },
    timestamp: new Date().toISOString(),
  };
}

export async function mintMpt(req: MptMintRequest): Promise<MintResult> {
  const mode = getXrplMode();
  if (mode === "simulation") return simulateMpt(req);

  const client = await getXrplClient();
  try {
    const wallet = getXrplWallet();
    const metaHex = buildMptMetadataHex(req.name, req.ticker);

    let flags = 0;
    if (req.transferable !== false) flags |= 32;  // tfMPTCanTransfer
    if (req.tradeable !== false) flags |= 16;     // tfMPTCanTrade
    if (req.clawback) flags |= 64;                // tfMPTCanClawback

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tx: any = {
      TransactionType: "MPTokenIssuanceCreate",
      Account: wallet.address,
      MaximumAmount: req.maxSupply,
      AssetScale: req.assetScale ?? 6,
      Flags: flags,
      MPTokenMetadata: metaHex,
    };
    if (req.transferFee && req.transferFee > 0) {
      tx.TransferFee = req.transferFee;
      tx.Flags |= 32; // must set tfMPTCanTransfer when TransferFee > 0
    }

    const prepared = await client.autofill(tx);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    const meta = result.result.meta as { TransactionResult?: string; mpt_issuance_id?: string } | undefined;

    return {
      ok: meta?.TransactionResult === "tesSUCCESS",
      mode: "live",
      chain: "xrpl",
      txHash: signed.hash,
      txType: "MPTokenIssuanceCreate",
      ledgerIndex: typeof result.result.ledger_index === "number" ? result.result.ledger_index : undefined,
      simulatedData: meta?.mpt_issuance_id ? { mptIssuanceId: meta.mpt_issuance_id } : undefined,
      timestamp: new Date().toISOString(),
    };
  } finally {
    await client.disconnect();
  }
}

// ─── Wallet Funding (XRP Payment from treasury) ──────────────────────────────

function simulateFund(req: WalletFundRequest): MintResult {
  return {
    ok: true,
    mode: "simulation",
    chain: "xrpl",
    txType: "Payment",
    simulatedData: {
      action: "Fund wallet",
      to: req.toAddress,
      amountXrp: req.amountXrp,
      drops: String(Math.floor(parseFloat(req.amountXrp) * 1_000_000)),
      memo: req.memo ?? null,
      note: "Simulation mode — no mainnet transaction submitted.",
    },
    timestamp: new Date().toISOString(),
  };
}

export async function fundWallet(req: WalletFundRequest): Promise<MintResult> {
  const mode = getXrplMode();
  if (mode === "simulation") return simulateFund(req);

  const client = await getXrplClient();
  try {
    const wallet = getXrplWallet();
    const drops = String(Math.floor(parseFloat(req.amountXrp) * 1_000_000));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tx: any = {
      TransactionType: "Payment",
      Account: wallet.address,
      Destination: req.toAddress,
      Amount: drops,
    };
    if (req.memo) {
      tx.Memos = [{
        Memo: {
          MemoData: Buffer.from(req.memo, "utf8").toString("hex").toUpperCase(),
        },
      }];
    }

    const prepared = await client.autofill(tx);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    const meta = result.result.meta as { TransactionResult?: string } | undefined;

    return {
      ok: meta?.TransactionResult === "tesSUCCESS",
      mode: "live",
      chain: "xrpl",
      txHash: signed.hash,
      txType: "Payment",
      ledgerIndex: typeof result.result.ledger_index === "number" ? result.result.ledger_index : undefined,
      simulatedData: { amountXrp: req.amountXrp, drops, to: req.toAddress },
      timestamp: new Date().toISOString(),
    };
  } finally {
    await client.disconnect();
  }
}

// ─── AMM Deposit (add liquidity to an existing pool) ─────────────────────────

function simulateAmmDeposit(req: AmmDepositRequest): MintResult {
  return {
    ok: true,
    mode: "simulation",
    chain: "xrpl",
    txType: "AMMDeposit",
    simulatedData: {
      action: "Deposit into AMM pool",
      asset1: req.asset1,
      asset2: req.asset2,
      amount1: req.amount1 ?? null,
      amount2: req.amount2 ?? null,
      lpTokenAmount: req.lpTokenAmount ?? null,
      note: "Simulation mode — no mainnet transaction submitted.",
    },
    timestamp: new Date().toISOString(),
  };
}

export async function ammDeposit(req: AmmDepositRequest): Promise<MintResult> {
  const mode = getXrplMode();
  if (mode === "simulation") return simulateAmmDeposit(req);

  const client = await getXrplClient();
  try {
    const wallet = getXrplWallet();

    const buildXrplAmt = (asset: XrplAmount, amount: string): import("xrpl").IssuedCurrencyAmount | string => {
      if (asset.currency === "XRP") return String(Math.floor(parseFloat(amount) * 1_000_000));
      return { currency: asset.currency, issuer: asset.issuer!, value: amount };
    };

    const buildAsset = (asset: XrplAmount): import("xrpl").IssuedCurrency | { currency: "XRP" } => {
      if (asset.currency === "XRP") return { currency: "XRP" };
      return { currency: asset.currency, issuer: asset.issuer! };
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tx: any = {
      TransactionType: "AMMDeposit",
      Account: wallet.address,
      Asset: buildAsset(req.asset1),
      Asset2: buildAsset(req.asset2),
      // tfLPToken=0x00010000, tfSingleAsset=0x00080000, tfTwoAsset=0x00100000
      Flags: req.amount1 && req.amount2 ? 0x00100000 : req.amount1 ? 0x00080000 : 0x00010000,
    };

    if (req.amount1) tx.Amount = buildXrplAmt(req.asset1, req.amount1);
    if (req.amount2) tx.Amount2 = buildXrplAmt(req.asset2, req.amount2);
    if (req.lpTokenAmount) {
      tx.LPTokenOut = { currency: "LP", value: req.lpTokenAmount };
    }

    const prepared = await client.autofill(tx);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    const meta = result.result.meta as { TransactionResult?: string } | undefined;

    return {
      ok: meta?.TransactionResult === "tesSUCCESS",
      mode: "live",
      chain: "xrpl",
      txHash: signed.hash,
      txType: "AMMDeposit",
      ledgerIndex: typeof result.result.ledger_index === "number" ? result.result.ledger_index : undefined,
      timestamp: new Date().toISOString(),
    };
  } finally {
    await client.disconnect();
  }
}
