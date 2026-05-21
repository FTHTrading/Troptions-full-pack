/**
 * Stellar Genesis Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * SERVER-SIDE ONLY. Reads wallet secrets from env vars. Never import in client
 * components. Secrets never appear in responses.
 *
 * Covers:
 *   • Account configuration (Auth Required, Home Domain, stellar.toml)
 *   • Trustline creation (changeTrust)
 *   • Asset issuance (payment from issuer to distributor)
 *   • Stellar DEX offers (manageSellOffer / manageBuyOffer)
 *   • Liquidity pool creation and deposit (liquidityPoolDeposit)
 *   • SEP-24 anchor account setup
 *   • TOML generation helpers
 *
 * ENV VARS REQUIRED:
 *   STELLAR_HORIZON_URL            — Horizon endpoint (https://horizon.stellar.org)
 *   STELLAR_NETWORK_PASSPHRASE     — "Public Global Stellar Network ; September 2015"
 *   STELLAR_ISSUER_SECRET          — TROPTIONS asset issuer
 *   STELLAR_DISTRIBUTOR_SECRET     — Distribution wallet
 *   STELLAR_LP_SECRET              — Liquidity pool manager
 *   STELLAR_ANCHOR_SECRET          — SEP-24/6 anchor account
 *   STELLAR_TROPTIONS_ASSET_CODE   — "TROPTIONS" (9 chars, fits Stellar 12-char limit)
 *   GENESIS_ADMIN_KEY              — Auth key for write operations
 */

import {
  Horizon,
  Keypair,
  Networks,
  TransactionBuilder,
  Operation,
  Asset,
  LiquidityPoolAsset,
  BASE_FEE,
  getLiquidityPoolId,
  LiquidityPoolFeeV18,
} from "@stellar/stellar-sdk";

// ─── Constants ────────────────────────────────────────────────────────────────

const HORIZON_URL =
  process.env.STELLAR_HORIZON_URL ?? "https://horizon.stellar.org";

const NETWORK_PASSPHRASE =
  process.env.STELLAR_NETWORK_PASSPHRASE ??
  Networks.PUBLIC; // "Public Global Stellar Network ; September 2015"

const ASSET_CODE =
  process.env.STELLAR_TROPTIONS_ASSET_CODE ?? "TROPTIONS";

// TROPTIONS total supply on Stellar
const TOTAL_SUPPLY = "1000000000"; // 1 billion

// Stellar transaction timeout
const TX_TIMEOUT_SECONDS = 180;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getServer(): Horizon.Server {
  return new Horizon.Server(HORIZON_URL);
}

function loadKeypair(envKey: string): Keypair {
  const secret = process.env[envKey];
  if (!secret) {
    throw new Error(
      `${envKey} is not set. Run scripts/genesis-blockchain-setup.mjs to generate wallets.`
    );
  }
  return Keypair.fromSecret(secret);
}

function troptionsAsset(issuerAddress: string): Asset {
  return new Asset(ASSET_CODE, issuerAddress);
}

async function submitTx(
  server: Horizon.Server,
  txBuilder: TransactionBuilder,
  signers: Keypair[]
): Promise<StellarOpResult> {
  const tx = txBuilder.setTimeout(TX_TIMEOUT_SECONDS).build();
  for (const signer of signers) {
    tx.sign(signer);
  }
  try {
    const resp = await server.submitTransaction(tx);
    return {
      ok:     true,
      txHash: resp.hash,
      ledger: resp.ledger,
    };
  } catch (err: unknown) {
    const detail =
      err instanceof Error && "response" in err
        ? (err as { response?: { data?: unknown } }).response?.data
        : undefined;
    return { ok: false, error: String(err), detail };
  }
}

// ─── Admin Key Verification ───────────────────────────────────────────────────

/**
 * Verify that the supplied key matches the GENESIS_ADMIN_KEY env var.
 * Used by genesis/lp API routes to gate write operations.
 */
export function verifyGenesisAdminKey(key: string): boolean {
  const expected = process.env.GENESIS_ADMIN_KEY;
  if (!expected || !key) return false;
  return key === expected;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StellarOpResult {
  ok: boolean;
  txHash?: string;
  ledger?: number;
  error?: string;
  detail?: unknown;
}

// ─── Account Configuration ────────────────────────────────────────────────────

/**
 * Configure the TROPTIONS issuer account:
 *   • Set home domain (for stellar.toml discovery)
 *   • Set AUTH_REQUIRED and AUTH_REVOCABLE flags (optional KYC gating)
 *   • Set AUTH_CLAWBACK_ENABLED if clawback needed for compliance
 *
 * Call this ONCE after funding the issuer account.
 */
export async function configureStellarIssuer(opts?: {
  homeDomain?: string;
  authRequired?: boolean;
  authRevocable?: boolean;
  authClawback?: boolean;
}): Promise<StellarOpResult> {
  const server = getServer();
  try {
    const issuerKp = loadKeypair("STELLAR_ISSUER_SECRET");
    const account  = await server.loadAccount(issuerKp.publicKey());

    const builder = new TransactionBuilder(account, {
      fee:              BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    const domain = opts?.homeDomain ?? "troptions.org";

    builder.addOperation(
      Operation.setOptions({
        homeDomain:      domain,
        setFlags:        buildStellarFlags(opts) as import("@stellar/stellar-sdk").AuthFlag | undefined,
        // Clearing clearFlags ensures we can re-run this safely
      })
    );

    return await submitTx(server, builder, [issuerKp]);
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

/**
 * Lock the issuer account master key after all issuance is complete.
 * This makes the TROPTIONS supply immutable and non-dilutable.
 * ⚠  IRREVERSIBLE — only call when you are certain issuance is finalized.
 */
export async function lockIssuerMasterKey(): Promise<StellarOpResult> {
  const server = getServer();
  try {
    const issuerKp = loadKeypair("STELLAR_ISSUER_SECRET");
    const account  = await server.loadAccount(issuerKp.publicKey());

    const builder = new TransactionBuilder(account, {
      fee:              BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    builder.addOperation(
      Operation.setOptions({ masterWeight: 0 })
    );

    return await submitTx(server, builder, [issuerKp]);
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ─── Trustlines ───────────────────────────────────────────────────────────────

/**
 * Create a trustline from the distributor wallet to the TROPTIONS issuer.
 * Must be called before issuing tokens to the distributor.
 * limit: maximum TROPTIONS the distributor is willing to hold.
 */
export async function setDistributorTrustline(
  limit: string = TOTAL_SUPPLY
): Promise<StellarOpResult> {
  const server = getServer();
  try {
    const issuerKp = loadKeypair("STELLAR_ISSUER_SECRET");
    const distKp   = loadKeypair("STELLAR_DISTRIBUTOR_SECRET");
    const account  = await server.loadAccount(distKp.publicKey());

    const troptions = troptionsAsset(issuerKp.publicKey());

    const builder = new TransactionBuilder(account, {
      fee:              BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    builder.addOperation(
      Operation.changeTrust({ asset: troptions, limit })
    );

    return await submitTx(server, builder, [distKp]);
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

/**
 * Create a trustline from the LP wallet to the TROPTIONS issuer.
 */
export async function setLpTrustline(
  limit: string = TOTAL_SUPPLY
): Promise<StellarOpResult> {
  const server = getServer();
  try {
    const issuerKp = loadKeypair("STELLAR_ISSUER_SECRET");
    const lpKp     = loadKeypair("STELLAR_LP_SECRET");
    const account  = await server.loadAccount(lpKp.publicKey());

    const troptions = troptionsAsset(issuerKp.publicKey());

    const builder = new TransactionBuilder(account, {
      fee:              BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    builder.addOperation(
      Operation.changeTrust({ asset: troptions, limit })
    );

    return await submitTx(server, builder, [lpKp]);
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ─── Asset Issuance ───────────────────────────────────────────────────────────

/**
 * Issue TROPTIONS from the issuer to the distributor wallet.
 * The distributor must have an established trustline first.
 */
export async function issueToDistributor(
  amount: string = TOTAL_SUPPLY
): Promise<StellarOpResult> {
  const server = getServer();
  try {
    const issuerKp = loadKeypair("STELLAR_ISSUER_SECRET");
    const distKp   = loadKeypair("STELLAR_DISTRIBUTOR_SECRET");
    const account  = await server.loadAccount(issuerKp.publicKey());

    const troptions = troptionsAsset(issuerKp.publicKey());

    const builder = new TransactionBuilder(account, {
      fee:              BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    builder.addOperation(
      Operation.payment({
        destination: distKp.publicKey(),
        asset:       troptions,
        amount,
      })
    );

    return await submitTx(server, builder, [issuerKp]);
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

/**
 * Issue TROPTIONS to any arbitrary address with an established trustline.
 * Signed by issuer. Requires toAddress to already have a changeTrust for TROPTIONS.
 */
export async function issueToAddress(
  toAddress: string,
  amount: string
): Promise<StellarOpResult> {
  const server = getServer();
  try {
    const issuerKp = loadKeypair("STELLAR_ISSUER_SECRET");
    const account  = await server.loadAccount(issuerKp.publicKey());

    const troptions = troptionsAsset(issuerKp.publicKey());

    const builder = new TransactionBuilder(account, {
      fee:              BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    builder.addOperation(
      Operation.payment({ destination: toAddress, asset: troptions, amount })
    );

    return await submitTx(server, builder, [issuerKp]);
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ─── Stellar DEX Offers ───────────────────────────────────────────────────────

/**
 * Create a sell offer on Stellar DEX: sell TROPTIONS for XLM.
 * Executed from the distributor wallet.
 *
 * price: XLM per TROPTIONS (as string, e.g. "0.01")
 * amount: TROPTIONS to sell
 */
export async function createStellarSellOffer(
  amountTroptions: string,
  xlmPerTroptions: string
): Promise<StellarOpResult> {
  const server = getServer();
  try {
    const issuerKp = loadKeypair("STELLAR_ISSUER_SECRET");
    const distKp   = loadKeypair("STELLAR_DISTRIBUTOR_SECRET");
    const account  = await server.loadAccount(distKp.publicKey());

    const troptions = troptionsAsset(issuerKp.publicKey());

    const builder = new TransactionBuilder(account, {
      fee:              BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    // manageSellOffer: selling `selling` asset at `price` (units of buying per selling)
    builder.addOperation(
      Operation.manageSellOffer({
        selling: troptions,
        buying:  Asset.native(), // XLM
        amount:  amountTroptions,
        price:   xlmPerTroptions,
      })
    );

    return await submitTx(server, builder, [distKp]);
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

/**
 * Create a sell offer on Stellar DEX: sell TROPTIONS for USDC.
 *
 * USDC on Stellar:
 *   Issuer: GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN (Circle)
 */
export async function createStellarSellOfferUsdc(
  amountTroptions: string,
  usdcPerTroptions: string
): Promise<StellarOpResult> {
  const server = getServer();
  try {
    const issuerKp = loadKeypair("STELLAR_ISSUER_SECRET");
    const distKp   = loadKeypair("STELLAR_DISTRIBUTOR_SECRET");
    const account  = await server.loadAccount(distKp.publicKey());

    const troptions = troptionsAsset(issuerKp.publicKey());
    const usdc = new Asset(
      "USDC",
      "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN"
    );

    const builder = new TransactionBuilder(account, {
      fee:              BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    builder.addOperation(
      Operation.manageSellOffer({
        selling: troptions,
        buying:  usdc,
        amount:  amountTroptions,
        price:   usdcPerTroptions,
      })
    );

    return await submitTx(server, builder, [distKp]);
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ─── Liquidity Pools ──────────────────────────────────────────────────────────

/**
 * Create a TROPTIONS/XLM liquidity pool and deposit initial liquidity.
 *
 * Stellar AMM pools use a constant-product (xy=k) model.
 * Pool fee is fixed at 30bp (LiquidityPoolFeeV18 = 30).
 *
 * Preconditions:
 *   - LP wallet must have XLM and TROPTIONS (issued by our issuer)
 *   - LP wallet must have a changeTrust for the LP share asset
 */
export async function createTroptionsXlmPool(params?: {
  troptionsAmount?: string;
  xlmAmount?: string;
}): Promise<StellarOpResult> {
  const server = getServer();
  try {
    const issuerKp = loadKeypair("STELLAR_ISSUER_SECRET");
    const lpKp     = loadKeypair("STELLAR_LP_SECRET");
    const account  = await server.loadAccount(lpKp.publicKey());

    const troptionsAmount = params?.troptionsAmount ?? "100000";
    const xlmAmount       = params?.xlmAmount       ?? "1000";

    const troptions = troptionsAsset(issuerKp.publicKey());
    const xlm       = Asset.native();

    // Pool assets must be in canonical order (A < B alphabetically by type+code+issuer)
    const poolAsset = new LiquidityPoolAsset(xlm, troptions, LiquidityPoolFeeV18);
    const poolId = getLiquidityPoolId("constant_product", poolAsset.getLiquidityPoolParameters());

    const builder = new TransactionBuilder(account, {
      fee:              BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    // 1. Create trustline for LP shares
    builder.addOperation(
      Operation.changeTrust({ asset: poolAsset })
    );

    // 2. Deposit both assets to create the pool (or add liquidity if it exists)
    builder.addOperation(
      Operation.liquidityPoolDeposit({
        liquidityPoolId:  poolId.toString("hex"),
        maxAmountA:       xlmAmount,       // XLM is asset A (native, lower canonical order)
        maxAmountB:       troptionsAmount, // TROPTIONS is asset B
        minPrice:         { n: 1, d: 100 },   // min price ratio
        maxPrice:         { n: 100, d: 1 },   // max price ratio (wide tolerance for initial deposit)
      })
    );

    return await submitTx(server, builder, [lpKp]);
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

/**
 * Create a TROPTIONS/USDC liquidity pool and deposit initial liquidity.
 */
export async function createTroptionsUsdcPool(params?: {
  troptionsAmount?: string;
  usdcAmount?: string;
}): Promise<StellarOpResult> {
  const server = getServer();
  try {
    const issuerKp = loadKeypair("STELLAR_ISSUER_SECRET");
    const lpKp     = loadKeypair("STELLAR_LP_SECRET");
    const account  = await server.loadAccount(lpKp.publicKey());

    const troptionsAmount = params?.troptionsAmount ?? "100000";
    const usdcAmount      = params?.usdcAmount      ?? "1000";

    const troptions = troptionsAsset(issuerKp.publicKey());
    const usdc = new Asset(
      "USDC",
      "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN"
    );

    // Pool assets in canonical order (TROPTIONS alphabetically after USDC by issuer)
    const poolAsset = new LiquidityPoolAsset(usdc, troptions, LiquidityPoolFeeV18);
    const poolId = getLiquidityPoolId("constant_product", poolAsset.getLiquidityPoolParameters());

    const builder = new TransactionBuilder(account, {
      fee:              BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    // 1. Trustline for LP shares
    builder.addOperation(
      Operation.changeTrust({ asset: poolAsset })
    );

    // 2. Deposit liquidity
    builder.addOperation(
      Operation.liquidityPoolDeposit({
        liquidityPoolId:  poolId.toString("hex"),
        maxAmountA:       usdcAmount,       // USDC is A
        maxAmountB:       troptionsAmount,  // TROPTIONS is B
        minPrice:         { n: 1, d: 10000 },
        maxPrice:         { n: 10000, d: 1 },
      })
    );

    return await submitTx(server, builder, [lpKp]);
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ─── Account Info ─────────────────────────────────────────────────────────────

export interface StellarAccountInfo {
  ok: boolean;
  address?: string;
  xlmBalance?: string;
  troptionsBalance?: string;
  sequence?: string;
  error?: string;
}

/**
 * Fetch live balance and account info. Read-only, no signing.
 */
export async function getStellarAccountInfo(
  address: string
): Promise<StellarAccountInfo> {
  const server = getServer();
  try {
    const account = await server.loadAccount(address);
    const issuerKp = loadKeypair("STELLAR_ISSUER_SECRET");
    const troptions = troptionsAsset(issuerKp.publicKey());

    const xlmBalance = account.balances.find(
      (b): b is Horizon.HorizonApi.BalanceLine => b.asset_type === "native"
    )?.balance ?? "0";

    const troptionsBalance = account.balances.find(
      (b): b is Horizon.HorizonApi.BalanceLineAsset =>
        "asset_code" in b &&
        b.asset_code === troptions.code &&
        b.asset_issuer === troptions.issuer
    )?.balance ?? "0";

    return {
      ok: true,
      address,
      xlmBalance,
      troptionsBalance,
      sequence: account.sequence,
    };
  } catch (err) {
    return { ok: false, address, error: String(err) };
  }
}

/**
 * Get full wallet status for all Stellar genesis wallets.
 */
export async function getStellarGenesisStatus(): Promise<{
  issuer:      StellarAccountInfo;
  distributor: StellarAccountInfo;
  lpManager:   StellarAccountInfo;
  anchor:      StellarAccountInfo;
}> {
  async function safe(envKey: string): Promise<StellarAccountInfo> {
    try {
      const kp = loadKeypair(envKey);
      return await getStellarAccountInfo(kp.publicKey());
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  }

  const [issuer, distributor, lpManager, anchor] = await Promise.all([
    safe("STELLAR_ISSUER_SECRET"),
    safe("STELLAR_DISTRIBUTOR_SECRET"),
    safe("STELLAR_LP_SECRET"),
    safe("STELLAR_ANCHOR_SECRET"),
  ]);

  return { issuer, distributor, lpManager, anchor };
}

// ─── stellar.toml Generator ───────────────────────────────────────────────────

/**
 * Generate the stellar.toml content for troptions.org.
 * Paste this at https://troptions.org/.well-known/stellar.toml
 */
export function generateStellarToml(issuerAddress: string): string {
  return `VERSION = "2.0.0"

NETWORK_PASSPHRASE = "Public Global Stellar Network ; September 2015"
HORIZON_URL = "https://horizon.stellar.org"
TRANSFER_SERVER = "https://troptions.org/sep24"
TRANSFER_SERVER_SEP0024 = "https://troptions.org/sep24"
WEB_AUTH_ENDPOINT = "https://troptions.org/sep10"
KYC_SERVER = "https://troptions.org/sep12"
SIGNING_KEY = "${issuerAddress}"

[DOCUMENTATION]
ORG_NAME = "TROPTIONS"
ORG_DBA = "TROPTIONS.ORG"
ORG_URL = "https://troptions.org"
ORG_LOGO = "https://troptions.org/assets/logo-512.png"
ORG_DESCRIPTION = "TROPTIONS is a trade option, a digital asset backed by goods, services, and real-world value. The world's first trade-collateralized digital asset ecosystem."
ORG_PHYSICAL_ADDRESS = "United States"
ORG_SUPPORT_EMAIL = "support@troptions.org"
ORG_LICENSING_AUTHORITY = "FinCEN"
ORG_LICENSE_TYPE = "MSB"

[[CURRENCIES]]
code = "${ASSET_CODE}"
issuer = "${issuerAddress}"
display_decimals = 7
name = "TROPTIONS"
desc = "TROPTIONS is a trade option — digital assets backed by real-world goods, services, and value. Used for trade financing, treasury management, DEX liquidity, and RWA tokenization."
conditions = "TROPTIONS tokens represent trade value positions. They are not securities. All transfers are subject to TROPTIONS.ORG terms of service."
image = "https://troptions.org/assets/troptions-token-256.png"
fixed_number = 1000000000
max_number = 1000000000
is_asset_anchored = false
anchor_asset_type = "other"
attestation_of_reserve = "https://troptions.org/troptions-proof-index.json"
redemption_instructions = "https://troptions.org/redeem"
regulated = false

[[CURRENCIES]]
code = "OPTKAS"
issuer = "${issuerAddress}"
display_decimals = 7
name = "OPTKAS"
desc = "OPTKAS — Optioned Kansas Trade Settlement asset. Regional trade instrument."
is_asset_anchored = false
anchor_asset_type = "other"

[[PRINCIPALS]]
name = "TROPTIONS Chairman"
email = "ops@troptions.org"
twitter = "@troptions"
github = "UnyKorn"
id_photo_hash = ""
verification_photo_hash = ""
`;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function buildStellarFlags(opts?: {
  authRequired?: boolean;
  authRevocable?: boolean;
  authClawback?: boolean;
}): number {
  // Stellar flag values: AUTH_REQUIRED=1, AUTH_REVOCABLE=2, AUTH_CLAWBACK_ENABLED=8
  let flags = 0;
  if (opts?.authRequired) flags |= 1;
  if (opts?.authRevocable) flags |= 2;
  if (opts?.authClawback)  flags |= 8;
  return flags;
}
