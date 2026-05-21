// TROPTIONS Exchange OS — XRPL Read-Only Client
// Uses HTTP JSON-RPC for CF Workers compatibility (no WebSocket / no xrpl npm package).
// NO private keys. NO signing. NO auto-submit.
// All write operations return unsigned transaction blobs.

import { xrplConfig } from "@/config/exchange-os/xrpl";
import type { XrplErrorResponse } from "./types";

/**
 * XRPL mainnet HTTP JSON-RPC endpoints — tried in order until one responds.
 * - xrplcluster.com  : Cloudflare-fronted cluster (primary, fast)
 * - s1.ripple.com    : Ripple full-history node
 * - s2.ripple.com    : Ripple reporting node
 */
const XRPL_HTTP_ENDPOINTS = [
  "https://xrplcluster.com/",
  "https://s1.ripple.com:51234/",
  "https://s2.ripple.com:51234/",
];

/** HTTP JSON-RPC helper — read-only commands only, tries each endpoint in order */
async function xrplRequest(
  method: string,
  params: Record<string, unknown>
): Promise<unknown> {
  let lastError: Error = new Error("No XRPL endpoint available");

  for (const url of XRPL_HTTP_ENDPOINTS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, params: [params] }),
        signal: controller.signal,
      });

      const data = (await res.json()) as {
        result?: { status?: string; error?: string; error_code?: number; error_message?: string } & Record<string, unknown>;
        error?: string;
      };

      const result = data.result;
      if (!result || result.status === "error" || result.error) {
        const err: XrplErrorResponse = {
          error: result?.error ?? data.error ?? "unknown_error",
          errorCode: result?.error_code,
          errorMessage: result?.error_message,
          status: "error",
        };
        throw err;
      }

      return result;
    } catch (e) {
      clearTimeout(timeout);
      if ((e as { status?: string }).status === "error") throw e; // XRPL protocol error — don't retry
      lastError = e instanceof Error ? e : new Error(String(e));
      // network / abort errors → try next endpoint
    }
  }

  throw lastError;
}

/** Allowed read-only XRPL commands — hardcoded whitelist for security */
const ALLOWED_READ_METHODS = new Set([
  "account_info",
  "account_lines",
  "account_offers",
  "book_offers",
  "amm_info",
  "ripple_path_find",
  "ledger",
  "ledger_current",
  "tx",
  "account_tx",
  "server_info",
]);

/** Read-only XRPL query — throws if method is not in allowlist */
export async function xrplReadQuery(
  method: string,
  params: Record<string, unknown>
): Promise<unknown> {
  if (!ALLOWED_READ_METHODS.has(method)) {
    throw new Error(
      `XRPL method '${method}' is not in the read-only allowlist. ` +
      `Write operations must go through the prepare* functions.`
    );
  }
  return xrplRequest(method, params);
}

/** Check if the XRPL WebSocket is reachable */
export async function checkXrplConnectivity(): Promise<{
  ok: boolean;
  network: string;
  mainnetEnabled: boolean;
  demoMode: boolean;
  latencyMs?: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    await xrplReadQuery("server_info", {});
    return {
      ok: true,
      network: xrplConfig.network,
      mainnetEnabled: xrplConfig.mainnetEnabled,
      demoMode: xrplConfig.demoMode,
      latencyMs: Date.now() - start,
    };
  } catch (err) {
    return {
      ok: false,
      network: xrplConfig.network,
      mainnetEnabled: xrplConfig.mainnetEnabled,
      demoMode: xrplConfig.demoMode,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
