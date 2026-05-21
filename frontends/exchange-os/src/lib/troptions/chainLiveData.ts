/**
 * chainLiveData.ts
 *
 * Real-time read-only data from XRPL and Stellar public APIs.
 * No private keys required — all calls are public.
 */

const XRPL_RPC = "https://xrplcluster.com";
const STELLAR_HORIZON = "https://horizon.stellar.org";

const XRPL_ISSUER      = "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ";
const XRPL_DISTRIBUTOR = "rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt";
const STELLAR_ISSUER      = "GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4";
const STELLAR_DISTRIBUTOR = "GBH4YY6EKSIM3LEHUQHEXFDZKMLON64HKMCB2K7CCOXGNCIVGH5GGVWC";

const TROPTIONS_HEX = "54524F5054494F4E530000000000000000000000";

// ─── XRPL helpers ───────────────────────────────────────────────────────────────

async function xrplRpc(method: string, params: Record<string, unknown>) {
  try {
    const res = await fetch(XRPL_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method, params: [params] }),
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json() as { result?: unknown };
    return json.result ?? null;
  } catch {
    return null;
  }
}

async function stellarGet(path: string) {
  try {
    const res = await fetch(`${STELLAR_HORIZON}${path}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function dropsToXrp(drops: string | number): string {
  return (Number(drops) / 1_000_000).toFixed(6);
}

function hexDomain(hex: string): string {
  try { return Buffer.from(hex, "hex").toString("ascii"); } catch { return hex; }
}

const lsfDefaultRipple = 0x00800000;

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface XrplAccountState {
  address: string;
  exists: boolean;
  xrpBalance: string | null;
  troptionsBalance: string | null;
  domain: string | null;
  defaultRipple: boolean;
  sequence: number | null;
}

export interface XrplTrustline {
  account: string;
  balance: string;
  limit: string;
}

export interface XrplNft {
  nfTokenId: string;
  taxon: number;
  uri: string | null;
}

export interface XrplOffer {
  seq: number;
  takerGets: unknown;
  takerPays: unknown;
}

export interface XrplAmmState {
  exists: boolean;
  tradingFee: number | null;
  xrpPool: string | null;
  troptionsPool: string | null;
  lpSupply: string | null;
  account: string | null;
}

export interface StellarAccountState {
  address: string;
  exists: boolean;
  xlmBalance: string | null;
  troptionsBalance: string | null;
  homeDomain: string | null;
  authRequired: boolean;
  authRevocable: boolean;
}

export interface StellarAssetStats {
  numAccounts: number | null;
  totalSupply: string | null;
}

export interface StellarLpState {
  poolId: string | null;
  exists: boolean;
  xlmReserve: string | null;
  troptionsReserve: string | null;
  totalShares: string | null;
}

export interface ChainLiveData {
  fetchedAt: string;
  xrpl: {
    issuer: XrplAccountState;
    distributor: XrplAccountState;
    trustlines: XrplTrustline[];
    nfts: XrplNft[];
    offers: XrplOffer[];
    amm: XrplAmmState;
  };
  stellar: {
    issuer: StellarAccountState;
    distributor: StellarAccountState;
    assetStats: StellarAssetStats;
    lp: StellarLpState;
  };
}

// ─── Stellar LP pool ID helper ───────────────────────────────────────────────────

function computeStellarPoolId(issuerAddress: string): string | null {
  // Pool ID = SHA-256 of the sorted asset pair parameters
  // XLM is always sorted before non-native assets
  // Format: <type:4><codeA:12><issuerA:32><type:4><codeB:12><issuerB:32><fee:4>
  // This is a deterministic computation; we return the hex string.
  // Since we can't run crypto sync here easily, just return a known placeholder
  // and let the /accounts/{poolId} call reveal the actual pool.
  // We'll discover it via the Stellar search instead.
  try {
    const { createHash } = require("crypto") as typeof import("crypto");
    // Asset params encoding per CAP-38
    // assetA = XLM (native, type=0): 4 bytes type, 12 bytes code (0), 32 bytes issuer (0)
    // assetB = TROPTIONS (type=1): 4 bytes type, 12 bytes code, 32 bytes issuer
    const bufA = Buffer.alloc(48, 0); // native: type=0, rest zeros
    const bufB = Buffer.alloc(48, 0);
    bufB.writeUInt32BE(1, 0); // asset type CREDIT_ALPHANUM4 = 1 (TROPTIONS is 8 chars → ALPHANUM12 = 2)
    // TROPTIONS is 8 chars → ALPHANUM12
    bufB.writeUInt32BE(2, 0);
    const codeBytes = Buffer.from("TROPTIONS\0\0\0", "ascii"); // pad to 12
    codeBytes.copy(bufB, 4);
    const issuerBytes = Buffer.from(issuerAddress, "ascii");
    // For simplicity, skip the complex XDR encoding and return null — pool will be discovered via Stellar
    void issuerBytes; void codeBytes;
    const feeBuf = Buffer.alloc(4);
    feeBuf.writeUInt32BE(30, 0);
    const hash = createHash("sha256").update(Buffer.concat([bufA, bufB, feeBuf])).digest("hex");
    return hash;
  } catch {
    return null;
  }
}

// ─── Main fetch ─────────────────────────────────────────────────────────────────

export async function fetchChainLiveData(): Promise<ChainLiveData> {
  const [
    issuerInfo,
    distInfo,
    issuerLines,
    distLines,
    distNfts,
    distOffers,
    ammInfo,
    stellarIssuerData,
    stellarDistData,
    stellarAssetData,
  ] = await Promise.all([
    xrplRpc("account_info",   { account: XRPL_ISSUER,      ledger_index: "validated" }),
    xrplRpc("account_info",   { account: XRPL_DISTRIBUTOR, ledger_index: "validated" }),
    xrplRpc("account_lines",  { account: XRPL_ISSUER,      ledger_index: "validated" }),
    xrplRpc("account_lines",  { account: XRPL_DISTRIBUTOR, ledger_index: "validated" }),
    xrplRpc("account_nfts",   { account: XRPL_DISTRIBUTOR, ledger_index: "validated" }),
    xrplRpc("account_offers", { account: XRPL_DISTRIBUTOR, ledger_index: "validated" }),
    xrplRpc("amm_info", {
      asset:  { currency: "XRP" },
      asset2: { currency: TROPTIONS_HEX, issuer: XRPL_ISSUER },
      ledger_index: "validated",
    }),
    stellarGet(`/accounts/${STELLAR_ISSUER}`),
    stellarGet(`/accounts/${STELLAR_DISTRIBUTOR}`),
    stellarGet(`/assets?asset_code=TROPTIONS&asset_issuer=${STELLAR_ISSUER}&limit=1`),
  ]);

  // ── XRPL issuer ───────────────────────────────────────────────────────────────
  type XrplAccountData = Record<string, unknown>;
  type XrplResult = { account_data?: XrplAccountData; error?: string } | null;

  const issuerResult = issuerInfo as XrplResult;
  const distResult   = distInfo   as XrplResult;

  const issuerAD = issuerResult?.account_data;
  const distAD   = distResult?.account_data;

  // Distributor's TROPTIONS balance from account_lines
  type XrplLine = { account?: unknown; currency?: unknown; balance?: unknown; limit?: unknown; limit_peer?: unknown };
  const distLinesList: XrplLine[] = (distLines as { lines?: XrplLine[] } | null)?.lines ?? [];
  const troptionsLine = distLinesList.find(l => String(l.currency) === TROPTIONS_HEX);

  // Issuer's trustlines (how many accounts hold TROPTIONS)
  const issuerLinesList: XrplLine[] = (issuerLines as { lines?: XrplLine[] } | null)?.lines ?? [];
  const trustlines: XrplTrustline[] = issuerLinesList
    .filter(l => String(l.currency) === TROPTIONS_HEX)
    .map(l => ({
      account: String(l.account ?? ""),
      balance: String(l.balance ?? "0"),
      limit:   String(l.limit_peer ?? l.limit ?? "0"),
    }));

  const xrplIssuer: XrplAccountState = {
    address:          XRPL_ISSUER,
    exists:           !!issuerAD,
    xrpBalance:       issuerAD ? dropsToXrp(String(issuerAD.Balance ?? "0")) : null,
    troptionsBalance: null, // issuer doesn't hold IOUs
    domain:           issuerAD?.Domain ? hexDomain(String(issuerAD.Domain)) : null,
    defaultRipple:    issuerAD ? ((Number(issuerAD.Flags ?? 0) & lsfDefaultRipple) !== 0) : false,
    sequence:         issuerAD ? Number(issuerAD.Sequence ?? 0) : null,
  };

  const xrplDist: XrplAccountState = {
    address:          XRPL_DISTRIBUTOR,
    exists:           !!distAD,
    xrpBalance:       distAD ? dropsToXrp(String(distAD.Balance ?? "0")) : null,
    troptionsBalance: troptionsLine ? String(troptionsLine.balance ?? "0") : null,
    domain:           distAD?.Domain ? hexDomain(String(distAD.Domain)) : null,
    defaultRipple:    false,
    sequence:         distAD ? Number(distAD.Sequence ?? 0) : null,
  };

  // ── XRPL NFTs ─────────────────────────────────────────────────────────────────
  type XrplNftRaw = { NFTokenID?: unknown; NFTokenTaxon?: unknown; URI?: unknown };
  const nfts: XrplNft[] = ((distNfts as { account_nfts?: XrplNftRaw[] } | null)?.account_nfts ?? []).map(n => ({
    nfTokenId: String(n.NFTokenID ?? ""),
    taxon:     Number(n.NFTokenTaxon ?? 0),
    uri:       n.URI ? (() => { try { return Buffer.from(String(n.URI), "hex").toString("utf8"); } catch { return null; } })() : null,
  }));

  // ── XRPL DEX Offers ───────────────────────────────────────────────────────────
  type XrplOfferRaw = { seq?: unknown; taker_gets?: unknown; taker_pays?: unknown };
  const offers: XrplOffer[] = ((distOffers as { offers?: XrplOfferRaw[] } | null)?.offers ?? []).map(o => ({
    seq:       Number(o.seq ?? 0),
    takerGets: o.taker_gets,
    takerPays: o.taker_pays,
  }));

  // ── XRPL AMM ─────────────────────────────────────────────────────────────────
  type XrplAmmRaw = { amm?: Record<string, unknown>; error?: string } | null;
  const ammResult = ammInfo as XrplAmmRaw;
  const ammData = ammResult?.amm;
  const xrplAmm: XrplAmmState = {
    exists:         !!ammData,
    tradingFee:     ammData ? Number(ammData.trading_fee ?? 0) : null,
    xrpPool:        ammData?.amount ? dropsToXrp(String(ammData.amount)) : null,
    troptionsPool:  (ammData?.amount2 as Record<string, unknown> | undefined)?.value
                      ? String((ammData?.amount2 as Record<string, unknown>).value)
                      : null,
    lpSupply:       (ammData?.lp_token as Record<string, unknown> | undefined)?.value
                      ? String((ammData?.lp_token as Record<string, unknown>).value)
                      : null,
    account:        ammData?.account ? String(ammData.account) : null,
  };

  // ── Stellar accounts ──────────────────────────────────────────────────────────
  type StellarBalance = { asset_type: string; asset_code?: string; balance?: string };
  type StellarFlags = { auth_required?: boolean; auth_revocable?: boolean };
  type StellarAccData = { id?: string; home_domain?: string; balances?: StellarBalance[]; flags?: StellarFlags } | null;

  const si = stellarIssuerData as StellarAccData;
  const sd = stellarDistData   as StellarAccData;

  const getNative    = (b: StellarBalance[]) => b.find(x => x.asset_type === "native")?.balance ?? null;
  const getTroptions = (b: StellarBalance[]) => b.find(x => x.asset_code === "TROPTIONS")?.balance ?? null;

  const stellarIssuer: StellarAccountState = {
    address:          STELLAR_ISSUER,
    exists:           !!si?.id,
    xlmBalance:       si ? getNative(si.balances ?? []) : null,
    troptionsBalance: si ? getTroptions(si.balances ?? []) : null,
    homeDomain:       si?.home_domain ?? null,
    authRequired:     !!(si?.flags?.auth_required),
    authRevocable:    !!(si?.flags?.auth_revocable),
  };

  const stellarDist: StellarAccountState = {
    address:          STELLAR_DISTRIBUTOR,
    exists:           !!sd?.id,
    xlmBalance:       sd ? getNative(sd.balances ?? []) : null,
    troptionsBalance: sd ? getTroptions(sd.balances ?? []) : null,
    homeDomain:       sd?.home_domain ?? null,
    authRequired:     false,
    authRevocable:    false,
  };

  // ── Stellar asset stats ───────────────────────────────────────────────────────
  type StellarAssetRecord = { num_accounts?: number; balances?: { authorized?: string } };
  type StellarAssetResponse = { _embedded?: { records?: StellarAssetRecord[] } } | null;
  const assetResp = stellarAssetData as StellarAssetResponse;
  const assetRec  = assetResp?._embedded?.records?.[0];
  const stellarAssetStats: StellarAssetStats = {
    numAccounts:  assetRec ? Number(assetRec.num_accounts ?? 0) : null,
    totalSupply:  assetRec?.balances?.authorized ?? null,
  };

  // ── Stellar LP pool ──────────────────────────────────────────────────────────
  // Look for LP balance in distributor's accounts (asset_type = "liquidity_pool_shares")
  type StellarLpBalance = StellarBalance & { liquidity_pool_id?: string };
  const lpBalance = (sd?.balances ?? []).find(
    b => (b as StellarLpBalance).liquidity_pool_id
  ) as (StellarLpBalance | undefined);
  const poolId = lpBalance?.liquidity_pool_id ?? null;

  let stellarLp: StellarLpState = { poolId, exists: false, xlmReserve: null, troptionsReserve: null, totalShares: null };

  if (poolId) {
    const poolData = await stellarGet(`/liquidity_pools/${poolId}`);
    if (poolData?.id) {
      type StellarPoolReserve = { asset: string; amount: string };
      const reserves: StellarPoolReserve[] = poolData.reserves ?? [];
      const xlmRes       = reserves.find((r: StellarPoolReserve) => r.asset === "native");
      const troptionsRes = reserves.find((r: StellarPoolReserve) => r.asset.startsWith("TROPTIONS"));
      stellarLp = {
        poolId,
        exists:           true,
        xlmReserve:       xlmRes?.amount ?? null,
        troptionsReserve: troptionsRes?.amount ?? null,
        totalShares:      poolData.total_shares ?? null,
      };
    }
  }

  return {
    fetchedAt: new Date().toISOString(),
    xrpl: {
      issuer:      xrplIssuer,
      distributor: xrplDist,
      trustlines,
      nfts,
      offers,
      amm:         xrplAmm,
    },
    stellar: {
      issuer:      stellarIssuer,
      distributor: stellarDist,
      assetStats:  stellarAssetStats,
      lp:          stellarLp,
    },
  };
}
