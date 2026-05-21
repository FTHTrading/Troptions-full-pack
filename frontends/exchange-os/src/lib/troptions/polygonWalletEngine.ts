/**
 * Polygon Wallet Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * Live Polygon mainnet balance queries via JSON-RPC. READ-ONLY.
 * No private keys, no signing. Uses public Polygon RPC with a fallback.
 *
 * Known deployed contracts on Polygon (chainId 137):
 *   KENNY token:  0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7 (100M cap)
 *   EVL token:    0xAFe185415D21671704EFaa5696dD219ACEB9fdA3 (500M cap)
 *   EVL Sale:     0x496b0802a3CB2Ce101A3F20e1dada33B78fDD806
 *   QuantumVaultFactory: 0x9BE7E6A6B212993671C036f2c593961A5cFFf05B
 *   QuantumMintVault v2: 0x8Df64Fa4dFEb8408fd27F267ab26B2493DfC63F5
 */

// ─── RPC endpoints ─────────────────────────────────────────────────────────

const POLYGON_RPC_PRIMARY  = process.env.POLYGON_RPC_URL ?? "https://polygon-rpc.com";
const POLYGON_RPC_FALLBACK = process.env.POLYGON_RPC_FALLBACK ?? "https://rpc-mainnet.matic.quorum.network";

// ERC-20 function selectors (keccak256 first 4 bytes)
const BALANCEOF_SELECTOR = "0x70a08231"; // balanceOf(address)
const DECIMALS_SELECTOR  = "0x313ce567"; // decimals()
const SYMBOL_SELECTOR    = "0x95d89b41"; // symbol()

// Known Polygon token contracts (Polygon mainnet, chainId 137)
export const POLYGON_KNOWN_TOKENS: Record<string, { address: string; decimals: number; name: string }> = {
  KENNY: { address: "0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7", decimals: 18, name: "KENNY Token" },
  EVL:   { address: "0xAFe185415D21671704EFaa5696dD219ACEB9fdA3", decimals: 18, name: "Evolve Token" },
  USDC:  { address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", decimals: 6,  name: "USD Coin (native)" },
  USDT:  { address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", decimals: 6,  name: "Tether USD" },
  WMATIC:{ address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", decimals: 18, name: "Wrapped MATIC" },
};

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PolygonTokenBalance {
  symbol:   string;
  name:     string;
  contract: string;
  balance:  string;
  decimals: number;
  raw:      string;
}

export interface PolygonAccountSummary {
  address:     string;
  chainId:     137;
  maticBalance: string;
  tokens:      PolygonTokenBalance[];
  explorerUrl: string;
  rpcUsed:     string;
  error?:      string;
}

// ─── JSON-RPC helpers ────────────────────────────────────────────────────────

let _rpcUrl = POLYGON_RPC_PRIMARY;

async function jsonRpc(method: string, params: unknown[]): Promise<unknown> {
  const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method, params });

  const tryRpc = async (url: string) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as { result?: unknown; error?: { message: string } };
    if (json.error) throw new Error(json.error.message);
    return json.result;
  };

  try {
    const result = await tryRpc(_rpcUrl);
    _rpcUrl = POLYGON_RPC_PRIMARY; // reset on success
    return result;
  } catch {
    _rpcUrl = POLYGON_RPC_FALLBACK;
    return tryRpc(POLYGON_RPC_FALLBACK);
  }
}

/**
 * Pad a 20-byte Ethereum address to a 32-byte ABI-encoded parameter.
 * Strips 0x prefix, pads with 24 leading zeros.
 */
function abiEncodeAddress(address: string): string {
  return address.replace(/^0x/i, "").toLowerCase().padStart(64, "0");
}

/**
 * Decode a hex string returned by eth_call into a base-10 string (no BigInt).
 * Uses string arithmetic to stay compatible with ES2017 target.
 */
function hexToDecimalString(hex: string): string {
  const clean = (hex.startsWith("0x") || hex.startsWith("0X")) ? hex.slice(2) : hex;
  if (!clean) return "0";
  // Parse via Number for small values, fall back to JS number for large hex
  // For ERC-20 we need arbitrary precision — use a simple base-16 → base-10 conversion
  let result = "0";
  for (const ch of clean) {
    result = multiplyStrBy16(result);
    result = addStrings(result, String(parseInt(ch, 16)));
  }
  return result;
}

function multiplyStrBy16(a: string): string {
  let carry = 0;
  let result = "";
  for (let i = a.length - 1; i >= 0; i--) {
    const product = parseInt(a[i], 10) * 16 + carry;
    carry = Math.floor(product / 10);
    result = String(product % 10) + result;
  }
  while (carry > 0) {
    result = String(carry % 10) + result;
    carry = Math.floor(carry / 10);
  }
  return result || "0";
}

function addStrings(a: string, b: string): string {
  let carry = 0;
  let result = "";
  let i = a.length - 1;
  let j = b.length - 1;
  while (i >= 0 || j >= 0 || carry) {
    const sum = (i >= 0 ? parseInt(a[i--], 10) : 0) +
                (j >= 0 ? parseInt(b[j--], 10) : 0) + carry;
    carry = Math.floor(sum / 10);
    result = String(sum % 10) + result;
  }
  return result || "0";
}

/**
 * Format a raw decimal string token amount using its decimal places.
 * Avoids BigInt — uses string division.
 */
function formatUnits(amountStr: string, decimals: number): string {
  if (!amountStr || amountStr === "0") return "0";
  // Pad left so we always have enough digits
  const padded = amountStr.padStart(decimals + 1, "0");
  const intPart  = padded.slice(0, padded.length - decimals) || "0";
  const fracPart = padded.slice(padded.length - decimals).replace(/0+$/, "");
  return fracPart ? `${intPart}.${fracPart}` : intPart;
}

// ─── Balance queries ─────────────────────────────────────────────────────────

/**
 * Fetch native MATIC/POL balance for an address.
 */
export async function getPolygonNativeBalance(address: string): Promise<string> {
  const result = await jsonRpc("eth_getBalance", [address, "latest"]) as string;
  const wei = hexToDecimalString(result);
  return formatUnits(wei, 18);
}

/**
 * Fetch ERC-20 token balance for an address via eth_call.
 */
export async function getErc20Balance(
  tokenAddress: string,
  holderAddress: string,
  decimals: number
): Promise<string> {
  const data = BALANCEOF_SELECTOR + abiEncodeAddress(holderAddress);
  const result = await jsonRpc("eth_call", [{ to: tokenAddress, data }, "latest"]) as string;
  const raw = hexToDecimalString(result);
  return formatUnits(raw, decimals);
}

/**
 * Full Polygon account summary: native balance + all known token balances.
 * READ-ONLY. No signing. No keys.
 */
export async function getPolygonAccountSummary(address: string): Promise<PolygonAccountSummary> {
  const lowerAddress = address.toLowerCase();

  try {
    const maticBalance = await getPolygonNativeBalance(address);
    const rpcUsed = _rpcUrl;

    const tokenResults = await Promise.allSettled(
      Object.entries(POLYGON_KNOWN_TOKENS).map(async ([symbol, token]) => {
        const balance = await getErc20Balance(token.address, address, token.decimals);
        return {
          symbol,
          name:     token.name,
          contract: token.address,
          balance,
          decimals: token.decimals,
          raw:      balance,
        } satisfies PolygonTokenBalance;
      })
    );

    const tokens: PolygonTokenBalance[] = tokenResults
      .filter((r): r is PromiseFulfilledResult<PolygonTokenBalance> => r.status === "fulfilled")
      .map((r) => r.value)
      .filter((t) => t.balance !== "0"); // only include non-zero balances

    return {
      address:      lowerAddress,
      chainId:      137,
      maticBalance,
      tokens,
      explorerUrl:  `https://polygonscan.com/address/${lowerAddress}`,
      rpcUsed,
    };
  } catch (err) {
    return {
      address:      lowerAddress,
      chainId:      137,
      maticBalance: "0",
      tokens:       [],
      explorerUrl:  `https://polygonscan.com/address/${lowerAddress}`,
      rpcUsed:      POLYGON_RPC_PRIMARY,
      error:        String(err),
    };
  }
}

// ─── Token info helpers ───────────────────────────────────────────────────────

export async function getPolygonTokenInfo(
  tokenAddress: string
): Promise<{ symbol: string; decimals: number } | null> {
  try {
    const [symbolHex, decimalsHex] = await Promise.all([
      jsonRpc("eth_call", [{ to: tokenAddress, data: SYMBOL_SELECTOR }, "latest"]) as Promise<string>,
      jsonRpc("eth_call", [{ to: tokenAddress, data: DECIMALS_SELECTOR }, "latest"]) as Promise<string>,
    ]);

    // ABI decode string: skip first 32 bytes (offset), next 32 bytes (length), then UTF-8 data
    const symbolBytes = symbolHex.slice(2); // strip 0x
    const len = parseInt(symbolBytes.slice(64, 128), 16);
    const symbol = Buffer.from(symbolBytes.slice(128, 128 + len * 2), "hex").toString("utf8");
    const decimals = parseInt(decimalsHex, 16);

    return { symbol, decimals };
  } catch {
    return null;
  }
}

// ─── Allowance queries ────────────────────────────────────────────────────────

// allowance(address owner, address spender) → uint256
const ALLOWANCE_SELECTOR = "0xdd62ed3e";

/**
 * Fetch ERC-20 allowance: how many tokens `ownerAddress` has approved `spenderAddress` to spend.
 * READ-ONLY. No keys. Uses eth_call.
 */
export async function getErc20Allowance(
  tokenAddress:   string,
  ownerAddress:   string,
  spenderAddress: string,
  decimals:       number
): Promise<string> {
  const data =
    ALLOWANCE_SELECTOR +
    abiEncodeAddress(ownerAddress) +
    abiEncodeAddress(spenderAddress);
  const result = await jsonRpc("eth_call", [{ to: tokenAddress, data }, "latest"]) as string;
  const raw = hexToDecimalString(result);
  return formatUnits(raw, decimals);
}

/**
 * Fetch all known TROPTIONS-ecosystem token allowances for owner → spender.
 */
export async function getKnownTokenAllowances(
  ownerAddress:   string,
  spenderAddress: string
): Promise<Array<{ symbol: string; allowance: string; tokenAddress: string }>> {
  const results = await Promise.allSettled(
    Object.entries(POLYGON_KNOWN_TOKENS).map(async ([symbol, token]) => ({
      symbol,
      allowance:    await getErc20Allowance(token.address, ownerAddress, spenderAddress, token.decimals),
      tokenAddress: token.address,
    }))
  );
  return results
    .filter((r): r is PromiseFulfilledResult<{ symbol: string; allowance: string; tokenAddress: string }> =>
      r.status === "fulfilled"
    )
    .map((r) => r.value);
}
