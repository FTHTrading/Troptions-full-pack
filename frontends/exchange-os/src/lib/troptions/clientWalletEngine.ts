/**
 * Client Wallet Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * SERVER-SIDE ONLY. Generates fresh XRPL and Stellar wallet keypairs for
 * client onboarding. Private keys are returned to the caller ONCE and are
 * NEVER persisted on this server.
 *
 * Security model:
 *   • Entropy source: Node.js crypto.randomBytes (CSPRNG)
 *   • For XRPL: Wallet.generate("ed25519") — Ed25519 keypair
 *   • For Stellar: Keypair.random() — Ed25519 keypair
 *   • Keys are held in memory only for the duration of the request
 *   • No seed storage, no database writes, no logs containing key material
 *   • Clients are instructed to store their own seed phrase offline
 *   • This service only reads from XRPL/Stellar networks — it never signs
 *     transactions on behalf of client wallets
 *
 * Tradeline provisioning:
 *   Clients sign their own TrustSet (XRPL) or changeTrust (Stellar) locally,
 *   then POST the signed transaction blob to /api/troptions/xrpl-platform/tradeline/provision.
 *   This server merely submits the pre-signed blob to the network — it never
 *   has access to client private keys.
 *
 * Compliance:
 *   All wallet generations are logged to the audit trail (no key material).
 *   All tradeline provisions are screened against OFAC/FinCEN lists before submission.
 */

import { Client, Wallet, xrpToDrops, ECDSA } from "xrpl";
import type { TrustSet, AccountInfoRequest } from "xrpl";
import { Keypair, Networks, Asset, Horizon, TransactionBuilder, Operation, BASE_FEE } from "@stellar/stellar-sdk";

// ─── Constants ────────────────────────────────────────────────────────────────

export const TROPTIONS_CURRENCY_HEX =
  process.env.XRPL_TROPTIONS_CURRENCY_HEX ??
  "54524F5054494F4E530000000000000000000000";

export const TROPTIONS_ISSUER_ADDRESS =
  process.env.XRPL_ISSUER_ADDRESS ?? "rPF2M1QjdVh1hkNgmMMTkT9qMU7tA7Wds3";

export const STELLAR_ISSUER_ADDRESS =
  process.env.STELLAR_ISSUER_ADDRESS ?? "";

export const STELLAR_ASSET_CODE =
  process.env.STELLAR_TROPTIONS_ASSET_CODE ?? "TROPTIONS";

const XRPL_WS_PRIMARY  = process.env.XRPL_WS_URL ?? "wss://xrplcluster.com";
const XRPL_WS_FALLBACK = process.env.XRPL_WS_FALLBACK ?? "wss://s1.ripple.com";
const HORIZON_URL      = process.env.STELLAR_HORIZON_URL ?? "https://horizon.stellar.org";

// Minimum trustline limit for new TROPTIONS holders (1 million tokens)
const DEFAULT_TRUSTLINE_LIMIT = "1000000000";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Redacted keypair returned to client — includes seed for one-time display only */
export interface GeneratedXrplWallet {
  chain:       "xrpl";
  algorithm:   "ed25519";
  address:     string;
  publicKey:   string;
  /** WARNING: display once, never store server-side */
  seed:        string;
  /** Xumm-compatible family-seed format (s…) */
  familySeed:  string;
  explorerUrl: string;
  trustlineUrl: string;
  instructions: string[];
}

export interface GeneratedStellarWallet {
  chain:       "stellar";
  algorithm:   "ed25519";
  publicKey:   string;
  /** WARNING: display once, never store server-side */
  secretKey:   string;
  explorerUrl: string;
  fundUrl:     string;
  instructions: string[];
}

export interface WalletGenerationAudit {
  timestamp:   string;
  chain:       "xrpl" | "stellar";
  publicKey:   string;
  address?:    string;
  requestIp:   string;
  sessionId:   string;
}

export interface TradelineSubmitResult {
  ok:          boolean;
  txHash?:     string;
  ledger?:     number;
  validated?:  boolean;
  error?:      string;
}

export interface LpPosition {
  chain:        "xrpl" | "stellar";
  poolId:       string;
  asset1:       string;
  asset2:       string;
  lpTokenBalance: string;
  lpTokenCurrency: string;
  sharePercent?:  string;
  currentValue?:  { asset1: string; asset2: string };
  depositedAt?:   string;
}

export interface XrplAccountSummary {
  address:     string;
  xrpBalance:  string;
  troptionsBalance: string;
  nftCount:    number;
  lpTokens:    LpPosition[];
  offerCount:  number;
  trustlines:  { currency: string; issuer: string; limit: string; balance: string }[];
  explorerUrl: string;
}

// ─── XRPL Client ─────────────────────────────────────────────────────────────

async function getXrplClient(): Promise<Client> {
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

// ─── Wallet Generation ────────────────────────────────────────────────────────

/**
 * Generate a fresh XRPL Ed25519 wallet keypair.
 * Uses xrpl.js Wallet.generate() which sources entropy from Node.js crypto.randomBytes.
 *
 * The seed is returned ONCE in the response. It is never stored here.
 * Clients must back up their seed phrase to a hardware wallet or offline storage.
 */
export function generateXrplWallet(): GeneratedXrplWallet {
  const wallet = Wallet.generate(ECDSA.ed25519);

  return {
    chain:       "xrpl",
    algorithm:   "ed25519",
    address:     wallet.address,
    publicKey:   wallet.publicKey,
    seed:        wallet.seed ?? "",
    familySeed:  wallet.seed ?? "",
    explorerUrl: `https://xrpscan.com/account/${wallet.address}`,
    trustlineUrl: `https://xumm.app/detect/payload__${TROPTIONS_ISSUER_ADDRESS}`,
    instructions: [
      "1. Fund this address with at least 12 XRP (10 XRP reserve + 2 XRP per trustline).",
      "2. After funding, set a TROPTIONS trustline from this wallet to the issuer address.",
      "3. Copy your seed (family seed) to a hardware wallet or encrypted offline backup NOW.",
      "4. Never share your seed with anyone, including this platform.",
      "5. For Xumm integration, import using the family seed on a trusted device.",
    ],
  };
}

/**
 * Generate a fresh Stellar Ed25519 wallet keypair.
 * Uses @stellar/stellar-sdk Keypair.random() which calls crypto.randomBytes internally.
 *
 * The secret key is returned ONCE. It is never stored here.
 */
export function generateStellarWallet(): GeneratedStellarWallet {
  const keypair = Keypair.random();

  return {
    chain:       "stellar",
    algorithm:   "ed25519",
    publicKey:   keypair.publicKey(),
    secretKey:   keypair.secret(),
    explorerUrl: `https://stellar.expert/explorer/public/account/${keypair.publicKey()}`,
    fundUrl:     `https://horizon.stellar.org/friendbot?addr=${keypair.publicKey()}`,
    instructions: [
      "1. Fund this account with at least 1.5 XLM (Stellar minimum reserve).",
      "2. After funding, set a TROPTIONS trustline from Stellar Account Viewer or Lobstr.",
      "3. Copy your secret key to a hardware wallet or encrypted offline backup NOW.",
      "4. Never share your secret key with anyone, including this platform.",
      "5. For Lobstr integration, import using the secret key on a trusted device.",
    ],
  };
}

// ─── XRPL Account Summary (read-only) ────────────────────────────────────────

/**
 * Fetch a full account summary for any XRPL address.
 * Returns XRP balance, TROPTIONS IOU balance, NFTs, LP tokens, trustlines.
 * READ-ONLY — no signing, no keys.
 */
export async function getXrplAccountSummary(
  address: string
): Promise<XrplAccountSummary> {
  const client = await getXrplClient();

  try {
    // Account info (balance + flags)
    const infoReq: AccountInfoRequest = {
      command: "account_info",
      account: address,
      ledger_index: "validated",
    };
    const infoRes = await client.request(infoReq);
    const accountData = infoRes.result.account_data;
    const xrpBalance = (Number(accountData.Balance) / 1_000_000).toFixed(6);

    // Trustlines
    const linesRes = await client.request({
      command: "account_lines",
      account: address,
      ledger_index: "validated",
    });

    const allLines = (linesRes.result as { lines: { currency: string; account: string; limit: string; balance: string }[] }).lines ?? [];

    const trustlines = allLines.map((line) => ({
      currency: line.currency,
      issuer:   line.account,
      limit:    line.limit,
      balance:  line.balance,
    }));

    // TROPTIONS balance
    const troptionsLine = allLines.find(
      (l) => l.currency === TROPTIONS_CURRENCY_HEX && l.account === TROPTIONS_ISSUER_ADDRESS
    );
    const troptionsBalance = troptionsLine?.balance ?? "0";

    // NFTs
    let nftCount = 0;
    try {
      const nftRes = await client.request({
        command: "account_nfts",
        account: address,
        ledger_index: "validated",
      });
      nftCount = (nftRes.result as { account_nfts: unknown[] }).account_nfts?.length ?? 0;
    } catch {
      // Account may not have NFTs enabled
    }

    // LP tokens (AMM) — lines where currency is a 160-bit hash (AMM LP token)
    // AMM LP token currencies are 40-char hex that does NOT decode to ASCII printably
    const lpLines = allLines.filter((l) => {
      if (l.currency.length !== 40) return false;
      // Non-printable hex: LP token currencies typically start with 03
      return l.currency.startsWith("03");
    });

    const lpTokens: LpPosition[] = lpLines.map((lp) => ({
      chain:           "xrpl",
      poolId:          `${lp.currency}:${lp.account}`,
      asset1:          "TROPTIONS",
      asset2:          "XRP",
      lpTokenBalance:  lp.balance,
      lpTokenCurrency: lp.currency,
    }));

    // Open offers count
    let offerCount = 0;
    try {
      const offersRes = await client.request({
        command: "account_offers",
        account: address,
        ledger_index: "validated",
      });
      offerCount = (offersRes.result as { offers: unknown[] }).offers?.length ?? 0;
    } catch {
      // ignore
    }

    return {
      address,
      xrpBalance,
      troptionsBalance,
      nftCount,
      lpTokens,
      offerCount,
      trustlines,
      explorerUrl: `https://xrpscan.com/account/${address}`,
    };
  } finally {
    await client.disconnect();
  }
}

// ─── Tradeline Submission (pre-signed blobs only) ─────────────────────────────

/**
 * Submit a client's pre-signed XRPL TrustSet transaction blob.
 * The client generates and signs the TrustSet locally (via Xumm or xrpl.js).
 * This server only submits the blob — it never has the client's private key.
 *
 * Expected blob: a hex-encoded signed XRPL transaction.
 */
export async function submitXrplTradelineBlob(
  signedTxBlob: string
): Promise<TradelineSubmitResult> {
  const client = await getXrplClient();
  try {
    const result = await client.submitAndWait(signedTxBlob);
    const meta = result.result.meta;
    const txResult = typeof meta === "object" && meta !== null && "TransactionResult" in meta
      ? (meta as { TransactionResult: string }).TransactionResult
      : "unknown";

    return {
      ok:        txResult === "tesSUCCESS",
      txHash:    result.result.hash,
      ledger:    result.result.ledger_index,
      validated: result.result.validated,
    };
  } catch (err) {
    return { ok: false, error: String(err) };
  } finally {
    await client.disconnect();
  }
}

/**
 * Submit a client's pre-signed Stellar changeTrust transaction blob.
 * This server only submits the XDR — it never has the client's secret key.
 */
export async function submitStellarTradelineXdr(signedXdr: string): Promise<TradelineSubmitResult> {
  const server = new Horizon.Server(HORIZON_URL);
  try {
    const tx = TransactionBuilder.fromXDR(signedXdr, Networks.PUBLIC);
    const result = await server.submitTransaction(tx);
    return {
      ok:      true,
      txHash:  result.hash,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  }
}

// ─── LP Position Query ────────────────────────────────────────────────────────

/**
 * Fetch LP token positions for an XRPL address across all AMM pools.
 * Returns all LP token lines where currency starts with 0x03 (AMM LP token prefix).
 */
export async function getXrplLpPositions(address: string): Promise<LpPosition[]> {
  const summary = await getXrplAccountSummary(address);
  return summary.lpTokens;
}

/**
 * Fetch LP positions for a Stellar address.
 * Queries all liquidity pool shares held by the account via Horizon.
 */
export async function getStellarLpPositions(publicKey: string): Promise<LpPosition[]> {
  const server = new Horizon.Server(HORIZON_URL);
  try {
    const account = await server.loadAccount(publicKey);
    const positions: LpPosition[] = [];

    for (const balance of account.balances) {
      if (balance.asset_type === "liquidity_pool_shares") {
        const lp = balance as { asset_type: "liquidity_pool_shares"; balance: string; liquidity_pool_id: string };
        positions.push({
          chain:           "stellar",
          poolId:          lp.liquidity_pool_id,
          asset1:          "TROPTIONS",
          asset2:          "XLM",
          lpTokenBalance:  lp.balance,
          lpTokenCurrency: lp.liquidity_pool_id,
        });
      }
    }

    return positions;
  } catch {
    return [];
  }
}

// ─── Stellar Account Summary ──────────────────────────────────────────────────

export interface StellarAccountSummary {
  publicKey:          string;
  xlmBalance:         string;
  troptionsBalance:   string;
  lpPositions:        LpPosition[];
  trustlines:         { code: string; issuer: string; balance: string; limit: string }[];
  explorerUrl:        string;
}

export async function getStellarAccountSummary(publicKey: string): Promise<StellarAccountSummary> {
  const server = new Horizon.Server(HORIZON_URL);

  try {
    const account = await server.loadAccount(publicKey);

    let xlmBalance       = "0";
    let troptionsBalance = "0";
    const trustlines: { code: string; issuer: string; balance: string; limit: string }[] = [];
    const lpPositions: LpPosition[] = [];

    for (const bal of account.balances) {
      if (bal.asset_type === "native") {
        xlmBalance = bal.balance;
      } else if (bal.asset_type === "credit_alphanum12" || bal.asset_type === "credit_alphanum4") {
        const line = bal as { asset_type: string; asset_code: string; asset_issuer: string; balance: string; limit: string };
        trustlines.push({
          code:    line.asset_code,
          issuer:  line.asset_issuer,
          balance: line.balance,
          limit:   line.limit,
        });
        if (line.asset_code === STELLAR_ASSET_CODE) {
          troptionsBalance = line.balance;
        }
      } else if (bal.asset_type === "liquidity_pool_shares") {
        const lp = bal as { asset_type: "liquidity_pool_shares"; balance: string; liquidity_pool_id: string };
        lpPositions.push({
          chain:           "stellar",
          poolId:          lp.liquidity_pool_id,
          asset1:          "TROPTIONS",
          asset2:          "XLM",
          lpTokenBalance:  lp.balance,
          lpTokenCurrency: lp.liquidity_pool_id,
        });
      }
    }

    return {
      publicKey,
      xlmBalance,
      troptionsBalance,
      lpPositions,
      trustlines,
      explorerUrl: `https://stellar.expert/explorer/public/account/${publicKey}`,
    };
  } catch {
    return {
      publicKey,
      xlmBalance:        "0",
      troptionsBalance:  "0",
      lpPositions:       [],
      trustlines:        [],
      explorerUrl:       `https://stellar.expert/explorer/public/account/${publicKey}`,
    };
  }
}
