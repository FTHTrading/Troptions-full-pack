/**
 * XRPL Genesis Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * SERVER-SIDE ONLY. Reads wallet seeds from env vars. Never import in client
 * components. Seeds never appear in responses.
 *
 * Covers:
 *   • Account configuration (AccountSet flags)
 *   • IOU issuance (TrustSet + Payment)
 *   • NFToken minting (XLS-20 NFTokenMint)
 *   • DEX offer creation (OfferCreate)
 *   • AMM pool creation (AMMCreate / AMMDeposit)
 *   • MPT issuance (XLS-33 MPTIssuanceCreate — pending amendment)
 *   • Tradeline setup helpers
 *
 * ENV VARS REQUIRED:
 *   XRPL_WS_URL                   — WebSocket URL (wss://xrplcluster.com)
 *   XRPL_WS_FALLBACK               — fallback WS URL
 *   XRPL_ISSUER_SEED               — TROPTIONS IOU issuer
 *   XRPL_DISTRIBUTOR_SEED          — Distribution wallet
 *   XRPL_TREASURY_SEED             — Cold treasury
 *   XRPL_NFT_ISSUER_SEED           — XLS-20 NFT issuer
 *   XRPL_MPT_ISSUER_SEED           — XLS-33 MPT issuer
 *   XRPL_DEX_MAKER_SEED            — DEX market maker
 *   XRPL_AMM_LP_SEED               — AMM liquidity provider
 *   XRPL_TROPTIONS_CURRENCY_HEX    — 40-char hex currency code
 *   GENESIS_ADMIN_KEY              — Auth key required for write operations
 */

import { Client, Wallet, xrpToDrops, dropsToXrp } from "xrpl";
import type {
  AccountSet,
  TrustSet,
  Payment,
  NFTokenMint,
  OfferCreate,
  AMMCreate,
  AMMDeposit,
  IssuedCurrencyAmount,
  TxResponse,
} from "xrpl";

// ─── Constants ────────────────────────────────────────────────────────────────

// TROPTIONS 9-char currency encoded as 20-byte uppercase hex (XLS-20 compatible)
export const TROPTIONS_CURRENCY_HEX =
  process.env.XRPL_TROPTIONS_CURRENCY_HEX ??
  "54524F5054494F4E530000000000000000000000";

export const XRPL_WS_PRIMARY   = process.env.XRPL_WS_URL ?? "wss://xrplcluster.com";
export const XRPL_WS_FALLBACK  = process.env.XRPL_WS_FALLBACK ?? "wss://s1.ripple.com";

// XRPL AMM trading fee denominator is 100_000 (1_000 = 1%)
const DEFAULT_AMM_TRADING_FEE = 500; // 0.5%

// AccountSet flags (numeric values from XRPL protocol)
const ASF_DEFAULT_RIPPLE   = 8;  // asfDefaultRipple
const ASF_REQUIRE_AUTH     = 2;  // asfRequireAuth
const ASF_DISALLOW_XRP     = 3;  // asfDisallowXRP
const ASF_REQUIRE_DEST_TAG = 1;  // asfRequireDest (for exchange deposits)
const ASF_NO_FREEZE        = 10; // asfNoFreeze (permanently disable freeze)

// Transfer fee is in millionths. 1_000_000_000 = 100%
// For NFTs, fee is in basis points (1/100th of 1%). 50_000 = 50%.

// ─── Client factory ───────────────────────────────────────────────────────────

async function getClient(): Promise<Client> {
  const client = new Client(XRPL_WS_PRIMARY);
  try {
    await client.connect();
    return client;
  } catch {
    const fallback = new Client(XRPL_WS_FALLBACK);
    await fallback.connect();
    return fallback;
  }
}

// ─── Wallet helpers ───────────────────────────────────────────────────────────

function loadWallet(envKey: string): Wallet {
  const seed = process.env[envKey];
  if (!seed) {
    throw new Error(
      `${envKey} is not set. Run scripts/genesis-blockchain-setup.mjs to generate wallets, ` +
      `then add the generated values to .env.local.`
    );
  }
  return Wallet.fromSeed(seed);
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GenesisOpResult {
  ok: boolean;
  txHash?: string;
  txResult?: string;
  validated?: boolean;
  ledger?: number;
  fee?: string;
  error?: string;
  detail?: unknown;
}

export interface IouIssueParams {
  /** Destination address that receives the tokens */
  toAddress: string;
  /** Amount in whole TROPTIONS (e.g. "1000000" for 1 million) */
  amount: string;
  /** Optional destination tag */
  destinationTag?: number;
}

export interface NftMintParams {
  /** URI pointing to NFT metadata (IPFS recommended) */
  uri: string;
  /** Transfer fee in basis points 0–50000 */
  transferFee: number;
  /** NFT flags bitmask */
  flags?: number;
  /** taxon — collection identifier (uint32) */
  taxon: number;
}

export interface DexOfferParams {
  /** Amount of XRP in drops to pay (as "takerGets") */
  takerGetsXrpDrops?: string;
  /** Amount of TROPTIONS to pay (as "takerGets") */
  takerGetsTroptions?: string;
  /** Amount of TROPTIONS to receive (as "takerPays") */
  takerPaysTroptions?: string;
  /** Amount of XRP in drops to receive */
  takePaysXrpDrops?: string;
  /** Expiry offset in seconds from now */
  expirySeconds?: number;
}

export interface AmmCreateParams {
  /** First asset — either XRP in drops or an IOU amount */
  asset1: string | IssuedCurrencyAmount;
  /** Second asset */
  asset2: string | IssuedCurrencyAmount;
  /** Trading fee in units of 1/100_000 (500 = 0.5%) */
  tradingFee?: number;
}

// ─── Account Configuration ────────────────────────────────────────────────────

/**
 * Configure the TROPTIONS IOU issuer account.
 * Sets DefaultRipple so token flows work, RequireAuth optional for KYC,
 * and a RequireDestTag for exchange deposit tracking.
 */
export async function configureIssuerAccount(opts?: {
  requireAuth?: boolean;
  noFreeze?: boolean;
}): Promise<GenesisOpResult> {
  const client = await getClient();
  try {
    const issuer = loadWallet("XRPL_ISSUER_SEED");

    const tx: AccountSet = {
      TransactionType: "AccountSet",
      Account: issuer.address,
      SetFlag: ASF_DEFAULT_RIPPLE,
      Domain: Buffer.from("TROPTIONS.ORG").toString("hex").toUpperCase(),
      // Email hash — set to SHA-256 of official contact email for XRPL DEX visibility
      TransferRate: 0, // 0 = no transfer fee on IOUs (set to > 1_000_000_000 for a fee)
    };

    const prepared = await client.autofill(tx);
    const signed = issuer.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    // Optionally set NoFreeze to permanently surrender freeze authority
    if (opts?.noFreeze) {
      const noFreezeTx: AccountSet = {
        TransactionType: "AccountSet",
        Account: issuer.address,
        SetFlag: ASF_NO_FREEZE,
      };
      const p2 = await client.autofill(noFreezeTx);
      const s2 = issuer.sign(p2);
      await client.submitAndWait(s2.tx_blob);
    }

    return buildResult(result);
  } catch (err) {
    return { ok: false, error: String(err) };
  } finally {
    await client.disconnect();
  }
}

/**
 * Configure the DEX market maker / distributor account.
 * Sets RequireDestTag for clean accounting, and optionally RequireAuth.
 */
export async function configureDistributorAccount(): Promise<GenesisOpResult> {
  const client = await getClient();
  try {
    const dist = loadWallet("XRPL_DISTRIBUTOR_SEED");

    const tx: AccountSet = {
      TransactionType: "AccountSet",
      Account: dist.address,
      SetFlag: ASF_REQUIRE_DEST_TAG,
    };

    const prepared = await client.autofill(tx);
    const signed = dist.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    return buildResult(result);
  } catch (err) {
    return { ok: false, error: String(err) };
  } finally {
    await client.disconnect();
  }
}

// ─── Trustline Setup ──────────────────────────────────────────────────────────

/**
 * Establish a trustline from the distributor wallet to the issuer.
 * Required before the issuer can send TROPTIONS to the distributor.
 * limit: maximum tokens the distributor is willing to hold.
 */
export async function setDistributorTrustline(
  limitAmount: string = "10000000000" // 10 billion
): Promise<GenesisOpResult> {
  const client = await getClient();
  try {
    const issuer = loadWallet("XRPL_ISSUER_SEED");
    const dist   = loadWallet("XRPL_DISTRIBUTOR_SEED");

    const tx: TrustSet = {
      TransactionType: "TrustSet",
      Account: dist.address,
      LimitAmount: {
        currency: TROPTIONS_CURRENCY_HEX,
        issuer:   issuer.address,
        value:    limitAmount,
      },
    };

    const prepared = await client.autofill(tx);
    const signed = dist.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    return buildResult(result);
  } catch (err) {
    return { ok: false, error: String(err) };
  } finally {
    await client.disconnect();
  }
}

/**
 * Establish a trustline from any address to the TROPTIONS issuer.
 * Used when onboarding exchange hot wallets or partner addresses.
 *
 * NOTE: the caller's wallet seed must be provided (not stored in env).
 * For exchange wallets, this is submitted through the exchange's own signing system.
 */
export async function setExternalTrustline(
  holderSeed: string,
  limitAmount: string,
  issuerAddress: string
): Promise<GenesisOpResult> {
  const client = await getClient();
  try {
    const holder = Wallet.fromSeed(holderSeed);

    const tx: TrustSet = {
      TransactionType: "TrustSet",
      Account: holder.address,
      LimitAmount: {
        currency: TROPTIONS_CURRENCY_HEX,
        issuer:   issuerAddress,
        value:    limitAmount,
      },
    };

    const prepared = await client.autofill(tx);
    const signed = holder.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    return buildResult(result);
  } catch (err) {
    return { ok: false, error: String(err) };
  } finally {
    await client.disconnect();
  }
}

// ─── IOU Issuance ─────────────────────────────────────────────────────────────

/**
 * Issue TROPTIONS tokens from issuer to distributor (or any address with a trustline).
 * Amount is a string to avoid JS floating point precision loss.
 */
export async function issueTokens(params: IouIssueParams): Promise<GenesisOpResult> {
  const client = await getClient();
  try {
    const issuer = loadWallet("XRPL_ISSUER_SEED");

    const amount: IssuedCurrencyAmount = {
      currency: TROPTIONS_CURRENCY_HEX,
      issuer:   issuer.address,
      value:    params.amount,
    };

    const tx: Payment = {
      TransactionType: "Payment",
      Account:         issuer.address,
      Destination:     params.toAddress,
      Amount:          amount,
      ...(params.destinationTag !== undefined
        ? { DestinationTag: params.destinationTag }
        : {}),
    };

    const prepared = await client.autofill(tx);
    const signed = issuer.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    return buildResult(result);
  } catch (err) {
    return { ok: false, error: String(err) };
  } finally {
    await client.disconnect();
  }
}

/**
 * Issue initial TROPTIONS supply to the distributor wallet.
 * Total supply of TROPTIONS: 1,000,000,000 (1 billion).
 */
export async function issueInitialSupply(): Promise<GenesisOpResult> {
  const dist = loadWallet("XRPL_DISTRIBUTOR_SEED");
  return issueTokens({
    toAddress: dist.address,
    amount:    "1000000000", // 1 billion
  });
}

// ─── NFToken Minting (XLS-20) ─────────────────────────────────────────────────

/**
 * Mint a single NFToken from the NFT issuer wallet.
 *
 * XLS-20 NFTokenMint flags:
 *   tfBurnable      = 0x00000001
 *   tfOnlyXRP       = 0x00000002  (restrict transfers to XRP only)
 *   tfTrustLine     = 0x00000004  (DEPRECATED in XLS-20v2 — do not use)
 *   tfTransferable  = 0x00000008  (allow transfers between holders)
 */
export async function mintNFToken(params: NftMintParams): Promise<GenesisOpResult> {
  const client = await getClient();
  try {
    const nftIssuer = loadWallet("XRPL_NFT_ISSUER_SEED");

    // URI must be hex-encoded for the XRPL protocol
    const uriHex = Buffer.from(params.uri, "utf8").toString("hex").toUpperCase();

    const tx: NFTokenMint = {
      TransactionType: "NFTokenMint",
      Account:         nftIssuer.address,
      NFTokenTaxon:    params.taxon,
      TransferFee:     params.transferFee,
      URI:             uriHex,
      Flags:           params.flags ?? 0x00000008, // tfTransferable by default
    };

    const prepared = await client.autofill(tx);
    const signed = nftIssuer.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    return buildResult(result);
  } catch (err) {
    return { ok: false, error: String(err) };
  } finally {
    await client.disconnect();
  }
}

/**
 * Mint the full genesis batch of NFToken collections.
 * Collection specs from XRPL_NFT_GENESIS_REGISTRY.
 *
 * Taxon assignments (deterministic, not random):
 *   0 — Institutional Credential
 *   1 — Exchange Member
 *   2 — RWA Property
 *   3 — Sovereign Bond
 *   4 — Impact Certificate
 *   5 — University Degree
 *   6 — Legacy Heritage
 *   7 — Art / Media
 */
export async function mintGenesisBatch(uriBase: string): Promise<GenesisOpResult[]> {
  const collections = [
    { taxon: 0, name: "Institutional Credential",   fee: 0,    transferable: false },
    { taxon: 1, name: "Exchange Member NFT",         fee: 0,    transferable: false },
    { taxon: 2, name: "RWA Real Estate Deed NFT",    fee: 250,  transferable: true  },
    { taxon: 3, name: "Sovereign Bond NFT",          fee: 0,    transferable: true  },
    { taxon: 4, name: "Impact Funding Certificate",  fee: 0,    transferable: true  },
    { taxon: 5, name: "University Degree NFT",       fee: 0,    transferable: false },
    { taxon: 6, name: "Legacy Heritage NFT",         fee: 500,  transferable: true  },
    { taxon: 7, name: "Art and Media NFT",           fee: 1000, transferable: true  },
  ];

  const results: GenesisOpResult[] = [];
  for (const col of collections) {
    const flags = col.transferable ? 0x00000008 : 0;
    const result = await mintNFToken({
      uri:          `${uriBase}/${col.taxon}/genesis`,
      transferFee:  col.fee,
      flags,
      taxon:        col.taxon,
    });
    results.push({ ...result, detail: { collection: col.name } });
  }
  return results;
}

// ─── DEX Offers ───────────────────────────────────────────────────────────────

/**
 * Create a sell offer: market maker sells TROPTIONS, receives XRP.
 * Places a standing order on the XRPL DEX order book.
 *
 * Example: sell 1000 TROPTIONS for 10 XRP
 *   takerGetsTroptions = "1000"
 *   takerPaysXrpDrops  = "10000000"  (10 XRP in drops)
 */
export async function createSellOffer(
  takerGetsTroptions: string,
  takerPaysXrpDrops: string,
  expirySeconds?: number
): Promise<GenesisOpResult> {
  const client = await getClient();
  try {
    const maker  = loadWallet("XRPL_DEX_MAKER_SEED");
    const issuer = loadWallet("XRPL_ISSUER_SEED");

    const takerGets: IssuedCurrencyAmount = {
      currency: TROPTIONS_CURRENCY_HEX,
      issuer:   issuer.address,
      value:    takerGetsTroptions,
    };

    const tx: OfferCreate = {
      TransactionType: "OfferCreate",
      Account:         maker.address,
      TakerGets:       takerGets,
      TakerPays:       takerPaysXrpDrops,
      ...(expirySeconds !== undefined
        ? { Expiration: Math.floor(Date.now() / 1000) - 946684800 + expirySeconds }
        : {}),
    };

    const prepared = await client.autofill(tx);
    const signed = maker.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    return buildResult(result);
  } catch (err) {
    return { ok: false, error: String(err) };
  } finally {
    await client.disconnect();
  }
}

/**
 * Create a buy offer: market maker buys TROPTIONS, pays XRP.
 * Provides the bid side of the order book.
 */
export async function createBuyOffer(
  takerGetsXrpDrops: string,
  takerPaysTroptions: string,
  expirySeconds?: number
): Promise<GenesisOpResult> {
  const client = await getClient();
  try {
    const maker  = loadWallet("XRPL_DEX_MAKER_SEED");
    const issuer = loadWallet("XRPL_ISSUER_SEED");

    const takerPays: IssuedCurrencyAmount = {
      currency: TROPTIONS_CURRENCY_HEX,
      issuer:   issuer.address,
      value:    takerPaysTroptions,
    };

    const tx: OfferCreate = {
      TransactionType: "OfferCreate",
      Account:         maker.address,
      TakerGets:       takerGetsXrpDrops,
      TakerPays:       takerPays,
      ...(expirySeconds !== undefined
        ? { Expiration: Math.floor(Date.now() / 1000) - 946684800 + expirySeconds }
        : {}),
    };

    const prepared = await client.autofill(tx);
    const signed = maker.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    return buildResult(result);
  } catch (err) {
    return { ok: false, error: String(err) };
  } finally {
    await client.disconnect();
  }
}

/**
 * Place the initial two-sided market:
 *   Ask:  sell 100,000 TROPTIONS for 1,000 XRP (0.01 XRP/TROPTIONS)
 *   Bid:  buy  100,000 TROPTIONS for 900 XRP  (0.009 XRP/TROPTIONS)
 *
 * Adjust prices to reflect current market conditions before calling.
 */
export async function placeSeedLiquidity(params?: {
  sellTroptions?: string;
  sellForXrp?: string;
  buyTroptions?: string;
  buyForXrp?: string;
}): Promise<GenesisOpResult[]> {
  const p = {
    sellTroptions: params?.sellTroptions ?? "100000",
    sellForXrp:    params?.sellForXrp    ?? (1000 * 1_000_000).toString(), // drops
    buyTroptions:  params?.buyTroptions  ?? "100000",
    buyForXrp:     params?.buyForXrp     ?? (900  * 1_000_000).toString(),
  };

  const results = await Promise.all([
    createSellOffer(p.sellTroptions, p.sellForXrp),
    createBuyOffer( p.buyForXrp,    p.buyTroptions),
  ]);

  return results;
}

// ─── AMM Pool Creation ────────────────────────────────────────────────────────

/**
 * Create an AMM pool pairing TROPTIONS with XRP.
 * Requires the AMM LP wallet to have a trustline to the TROPTIONS issuer first.
 *
 * Starting price: 100,000 TROPTIONS : 1,000 XRP = 0.01 XRP per TROPTIONS
 */
export async function createTroptionsXrpAmm(params?: {
  troptionsAmount?: string;
  xrpAmount?: string;
  tradingFee?: number;
}): Promise<GenesisOpResult> {
  const client = await getClient();
  try {
    const lpWallet = loadWallet("XRPL_AMM_LP_SEED");
    const issuer   = loadWallet("XRPL_ISSUER_SEED");

    const troptionsAmount = params?.troptionsAmount ?? "100000";
    const xrpAmount       = params?.xrpAmount       ?? "1000";
    const tradingFee      = params?.tradingFee       ?? DEFAULT_AMM_TRADING_FEE;

    const asset1: IssuedCurrencyAmount = {
      currency: TROPTIONS_CURRENCY_HEX,
      issuer:   issuer.address,
      value:    troptionsAmount,
    };

    const tx: AMMCreate = {
      TransactionType: "AMMCreate",
      Account:         lpWallet.address,
      Amount:          asset1,
      Amount2:         xrpToDrops(xrpAmount),
      TradingFee:      tradingFee,
    };

    const prepared = await client.autofill(tx);
    const signed = lpWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    return buildResult(result);
  } catch (err) {
    return { ok: false, error: String(err) };
  } finally {
    await client.disconnect();
  }
}

/**
 * Deposit additional liquidity into an existing TROPTIONS/XRP AMM pool.
 */
export async function depositAmmLiquidity(params: {
  troptionsAmount: string;
  xrpAmount: string;
  lpIssuerAddress: string;
}): Promise<GenesisOpResult> {
  const client = await getClient();
  try {
    const lpWallet = loadWallet("XRPL_AMM_LP_SEED");
    const issuer   = loadWallet("XRPL_ISSUER_SEED");

    const asset1: IssuedCurrencyAmount = {
      currency: TROPTIONS_CURRENCY_HEX,
      issuer:   issuer.address,
      value:    params.troptionsAmount,
    };

    const tx: AMMDeposit = {
      TransactionType: "AMMDeposit",
      Account:         lpWallet.address,
      Asset: {
        currency: TROPTIONS_CURRENCY_HEX,
        issuer:   issuer.address,
      },
      Asset2:  { currency: "XRP" },
      Amount:  asset1,
      Amount2: xrpToDrops(params.xrpAmount),
      Flags:   0x00100000, // tfTwoAsset
    };

    const prepared = await client.autofill(tx);
    const signed = lpWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    return buildResult(result);
  } catch (err) {
    return { ok: false, error: String(err) };
  } finally {
    await client.disconnect();
  }
}

// ─── Account Info ─────────────────────────────────────────────────────────────

/**
 * Fetch live balance and account info for a wallet.
 * Safe to call — read-only, no signing.
 */
export async function getAccountInfo(address: string): Promise<{
  ok: boolean;
  address: string;
  xrpBalance?: string;
  sequence?: number;
  ownerCount?: number;
  error?: string;
}> {
  const client = await getClient();
  try {
    const resp = await client.request({
      command:      "account_info",
      account:      address,
      ledger_index: "validated",
    });

    const data = resp.result.account_data;
    return {
      ok:          true,
      address,
      xrpBalance:  String(dropsToXrp(String(data.Balance))),
      sequence:    data.Sequence,
      ownerCount:  Number(data.OwnerCount),
    };
  } catch (err) {
    return { ok: false, address, error: String(err) };
  } finally {
    await client.disconnect();
  }
}

/**
 * Fetch all TROPTIONS trustlines for an account.
 */
export async function getAccountTrustlines(address: string): Promise<{
  ok: boolean;
  trustlines: Array<{ account: string; balance: string; limit: string; limit_peer: string }>;
  error?: string;
}> {
  const client = await getClient();
  try {
    const resp = await client.request({
      command:       "account_lines",
      account:       address,
      ledger_index:  "validated",
    });

    const troptionsLines = resp.result.lines.filter(
      (l: { currency: string }) => l.currency === TROPTIONS_CURRENCY_HEX
    );

    return { ok: true, trustlines: troptionsLines };
  } catch (err) {
    return { ok: false, trustlines: [], error: String(err) };
  } finally {
    await client.disconnect();
  }
}

/**
 * Get full wallet status summary for the genesis wallet set.
 */
export async function getGenesisWalletStatus(): Promise<{
  issuer:      { ok: boolean; address?: string; xrpBalance?: string; error?: string };
  distributor: { ok: boolean; address?: string; xrpBalance?: string; error?: string };
  treasury:    { ok: boolean; address?: string; xrpBalance?: string; error?: string };
  nftIssuer:   { ok: boolean; address?: string; xrpBalance?: string; error?: string };
  dexMaker:    { ok: boolean; address?: string; xrpBalance?: string; error?: string };
  ammLp:       { ok: boolean; address?: string; xrpBalance?: string; error?: string };
}> {
  async function safe(envKey: string) {
    try {
      const w = loadWallet(envKey);
      const info = await getAccountInfo(w.address);
      return { ...info, address: w.address };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  }

  const [issuer, distributor, treasury, nftIssuer, dexMaker, ammLp] = await Promise.all([
    safe("XRPL_ISSUER_SEED"),
    safe("XRPL_DISTRIBUTOR_SEED"),
    safe("XRPL_TREASURY_SEED"),
    safe("XRPL_NFT_ISSUER_SEED"),
    safe("XRPL_DEX_MAKER_SEED"),
    safe("XRPL_AMM_LP_SEED"),
  ]);

  return { issuer, distributor, treasury, nftIssuer, dexMaker, ammLp };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildResult(result: TxResponse): GenesisOpResult {
  const meta = result.result.meta as Record<string, unknown> | undefined;
  const txResult = (meta?.TransactionResult as string | undefined) ?? "unknown";
  const validated = result.result.validated ?? false;
  const hash = result.result.hash ?? result.result.tx_json?.hash;

  return {
    ok:        txResult === "tesSUCCESS",
    txHash:    String(hash ?? ""),
    txResult,
    validated,
    ledger:    result.result.ledger_index,
    fee:       String((result.result.tx_json as Record<string, unknown>)?.Fee ?? ""),
  };
}

/**
 * Verify the admin key from a request matches GENESIS_ADMIN_KEY env var.
 * Returns true if authorized.
 */
export function verifyGenesisAdminKey(providedKey: string): boolean {
  const expected = process.env.GENESIS_ADMIN_KEY;
  if (!expected || expected.length < 32) return false;
  // Constant-time comparison
  if (providedKey.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= providedKey.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
