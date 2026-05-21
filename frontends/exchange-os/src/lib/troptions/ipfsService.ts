/**
 * IPFS / Kubo Integration Service
 *
 * Communicates with a locally-running Kubo node via its RPC API (port 5001).
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  SECURITY: Do NOT expose port 5001 through Cloudflare, nginx,       ║
 * ║  any reverse proxy, or any public IP. The Kubo RPC API has full     ║
 * ║  admin control over your IPFS node (add, pin, config, shutdown).    ║
 * ║  Only localhost (127.0.0.1) access is safe.                         ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Enable this module by setting IPFS_LOCAL_ENABLED=true in .env.local.
 * When disabled, all methods return safe no-op / disabled responses.
 */

const KUBO_API_BASE = process.env.IPFS_RPC_URL ?? "http://127.0.0.1:5001";
const KUBO_GATEWAY = process.env.IPFS_GATEWAY_URL ?? "http://127.0.0.1:8080";

/** Guards all public-facing methods — returns false if integration is disabled */
function isEnabled(): boolean {
  return process.env.IPFS_LOCAL_ENABLED === "true";
}

/** Rejects any non-localhost API URL to prevent accidental public exposure */
function assertLocalOnly(url: string): void {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname;
    if (host !== "127.0.0.1" && host !== "localhost" && host !== "::1") {
      throw new Error(
        `[ipfsService] SECURITY: IPFS_RPC_URL must be a localhost address. ` +
          `Received: ${host}. Do not expose the Kubo RPC API publicly.`,
      );
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes("SECURITY:")) throw e;
    throw new Error(`[ipfsService] Invalid IPFS_RPC_URL: ${url}`);
  }
}

// Validate at module load time (server-side only, guarded by enabled check)
if (isEnabled() && typeof window === "undefined") {
  assertLocalOnly(KUBO_API_BASE);
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IpfsHealthResult {
  ok: boolean;
  peerId?: string;
  agentVersion?: string;
  protocolVersion?: string;
  addresses?: string[];
  error?: string;
}

export interface IpfsAddResult {
  ok: boolean;
  cid?: string;
  name?: string;
  size?: number;
  ipfsUri?: string;
  localGatewayUrl?: string;
  timestamp?: string;
  error?: string;
}

export interface IpfsPinResult {
  ok: boolean;
  cid?: string;
  pinned?: boolean;
  error?: string;
}

export interface IpfsCidInfo {
  ok: boolean;
  cid?: string;
  pinned?: boolean;
  size?: number;
  error?: string;
}

export interface IpfsPeerStats {
  ok: boolean;
  peerCount?: number;
  repoSize?: number;
  numObjects?: number;
  storageMax?: number;
  error?: string;
}

// ─── Health ───────────────────────────────────────────────────────────────────

/**
 * Health check — queries GET /api/v0/id on the local Kubo node.
 * Returns ok:false with error if disabled or node is unreachable.
 */
export async function ipfsHealthCheck(): Promise<IpfsHealthResult> {
  if (!isEnabled()) {
    return { ok: false, error: "IPFS integration disabled (IPFS_LOCAL_ENABLED not set)" };
  }
  try {
    const res = await fetch(`${KUBO_API_BASE}/api/v0/id`, {
      method: "POST",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { ok: false, error: `Kubo API returned ${res.status}` };
    const data = (await res.json()) as Record<string, unknown>;
    return {
      ok: true,
      peerId: String(data.ID ?? ""),
      agentVersion: String(data.AgentVersion ?? ""),
      protocolVersion: String(data.ProtocolVersion ?? ""),
      addresses: Array.isArray(data.Addresses)
        ? (data.Addresses as string[])
        : [],
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// ─── Add ──────────────────────────────────────────────────────────────────────

/**
 * Adds a JSON document or string to IPFS via the local Kubo node.
 * Returns the CID, size, ipfs:// URI, and local gateway URL.
 *
 * @param content  String or serialisable object to store
 * @param filename Optional display filename (used in Kubo form field)
 */
export async function ipfsAddJson(
  content: unknown,
  filename = "document.json",
): Promise<IpfsAddResult> {
  if (!isEnabled()) {
    return { ok: false, error: "IPFS integration disabled (IPFS_LOCAL_ENABLED not set)" };
  }
  try {
    const body = typeof content === "string" ? content : JSON.stringify(content, null, 2);
    const blob = new Blob([body], { type: "application/json" });
    const form = new FormData();
    form.append("file", blob, filename);

    const res = await fetch(`${KUBO_API_BASE}/api/v0/add?pin=true&quieter=false`, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) {
      return { ok: false, error: `Kubo /add returned ${res.status}` };
    }

    // Kubo returns NDJSON — last line is the root object
    const text = await res.text();
    const lines = text.trim().split("\n").filter(Boolean);
    const last = JSON.parse(lines[lines.length - 1]) as Record<string, unknown>;
    const cid = String(last.Hash ?? "");
    const size = Number(last.Size ?? 0);

    return {
      ok: true,
      cid,
      name: filename,
      size,
      ipfsUri: `ipfs://${cid}`,
      localGatewayUrl: `${KUBO_GATEWAY}/ipfs/${cid}`,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Adds a raw Uint8Array / Buffer (e.g. a PDF) to IPFS.
 */
export async function ipfsAddBuffer(
  data: Uint8Array<ArrayBuffer>,
  filename: string,
): Promise<IpfsAddResult> {
  if (!isEnabled()) {
    return { ok: false, error: "IPFS integration disabled (IPFS_LOCAL_ENABLED not set)" };
  }
  try {
    const blob = new Blob([data]);
    const form = new FormData();
    form.append("file", blob, filename);

    const res = await fetch(`${KUBO_API_BASE}/api/v0/add?pin=true`, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(60000),
    });
    if (!res.ok) return { ok: false, error: `Kubo /add returned ${res.status}` };

    const text = await res.text();
    const lines = text.trim().split("\n").filter(Boolean);
    const last = JSON.parse(lines[lines.length - 1]) as Record<string, unknown>;
    const cid = String(last.Hash ?? "");

    return {
      ok: true,
      cid,
      name: filename,
      size: Number(last.Size ?? 0),
      ipfsUri: `ipfs://${cid}`,
      localGatewayUrl: `${KUBO_GATEWAY}/ipfs/${cid}`,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// ─── Pin ──────────────────────────────────────────────────────────────────────

/**
 * Pins a CID locally so Kubo does not garbage-collect it.
 */
export async function ipfsPin(cid: string): Promise<IpfsPinResult> {
  if (!isEnabled()) {
    return { ok: false, error: "IPFS integration disabled" };
  }
  if (!isValidCid(cid)) {
    return { ok: false, error: `Invalid CID: ${cid}` };
  }
  try {
    const res = await fetch(
      `${KUBO_API_BASE}/api/v0/pin/add?arg=${encodeURIComponent(cid)}&recursive=true`,
      { method: "POST", signal: AbortSignal.timeout(30000) },
    );
    if (!res.ok) return { ok: false, cid, error: `Kubo /pin/add returned ${res.status}` };
    return { ok: true, cid, pinned: true };
  } catch (err) {
    return { ok: false, cid, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Checks whether a CID is pinned locally.
 */
export async function ipfsIsPinned(cid: string): Promise<IpfsPinResult> {
  if (!isEnabled()) {
    return { ok: false, error: "IPFS integration disabled" };
  }
  if (!isValidCid(cid)) {
    return { ok: false, error: `Invalid CID: ${cid}` };
  }
  try {
    const res = await fetch(
      `${KUBO_API_BASE}/api/v0/pin/ls?arg=${encodeURIComponent(cid)}&type=recursive`,
      { method: "POST", signal: AbortSignal.timeout(10000) },
    );
    if (res.status === 500) {
      // Kubo returns 500 if CID is not pinned
      return { ok: true, cid, pinned: false };
    }
    if (!res.ok) return { ok: false, cid, error: `Kubo /pin/ls returned ${res.status}` };
    const data = (await res.json()) as { Keys?: Record<string, unknown> };
    const pinned = data.Keys != null && cid in data.Keys;
    return { ok: true, cid, pinned };
  } catch (err) {
    return { ok: false, cid, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// ─── Fetch / stat ─────────────────────────────────────────────────────────────

/**
 * Returns block stat for a CID (size, cumulative size).
 * Read-only — does not mutate any data.
 */
export async function ipfsCidStat(cid: string): Promise<IpfsCidInfo> {
  if (!isEnabled()) {
    return { ok: false, error: "IPFS integration disabled" };
  }
  if (!isValidCid(cid)) {
    return { ok: false, error: `Invalid CID: ${cid}` };
  }
  try {
    const res = await fetch(
      `${KUBO_API_BASE}/api/v0/object/stat?arg=${encodeURIComponent(cid)}`,
      { method: "POST", signal: AbortSignal.timeout(10000) },
    );
    if (!res.ok) return { ok: false, cid, error: `Kubo /object/stat returned ${res.status}` };
    const data = (await res.json()) as { CumulativeSize?: number };
    const pinCheck = await ipfsIsPinned(cid);
    return {
      ok: true,
      cid,
      pinned: pinCheck.pinned ?? false,
      size: data.CumulativeSize,
    };
  } catch (err) {
    return { ok: false, cid, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Returns repo statistics: storage used, number of objects, max storage.
 */
export async function ipfsRepoStats(): Promise<IpfsPeerStats> {
  if (!isEnabled()) {
    return { ok: false, error: "IPFS integration disabled" };
  }
  try {
    const [repoRes, swarmRes] = await Promise.all([
      fetch(`${KUBO_API_BASE}/api/v0/repo/stat`, {
        method: "POST",
        signal: AbortSignal.timeout(10000),
      }),
      fetch(`${KUBO_API_BASE}/api/v0/swarm/peers`, {
        method: "POST",
        signal: AbortSignal.timeout(10000),
      }),
    ]);

    const repo = repoRes.ok
      ? ((await repoRes.json()) as Record<string, unknown>)
      : {};
    const swarm = swarmRes.ok
      ? ((await swarmRes.json()) as { Peers?: unknown[] })
      : {};

    return {
      ok: true,
      repoSize: Number(repo.RepoSize ?? 0),
      numObjects: Number(repo.NumObjects ?? 0),
      storageMax: Number(repo.StorageMax ?? 0),
      peerCount: Array.isArray(swarm.Peers) ? swarm.Peers.length : 0,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// ─── Utilities ────────────────────────────────────────────────────────────────

/**
 * Returns the local gateway URL for a CID.
 * Safe to call in UI — does not require the node to be running.
 */
export function ipfsGatewayUrl(cid: string): string {
  return `${KUBO_GATEWAY}/ipfs/${cid}`;
}

/**
 * Returns an ipfs:// URI for a CID.
 */
export function ipfsUri(cid: string): string {
  return `ipfs://${cid}`;
}

/**
 * Basic CID format validation (CIDv0 Qm... or CIDv1 bafy...).
 * Does not perform full multihash verification — use for input sanitisation only.
 */
export function isValidCid(cid: string): boolean {
  if (!cid || typeof cid !== "string") return false;
  // CIDv0: Qm + 44 base58 chars = 46 total
  if (/^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(cid)) return true;
  // CIDv1: bafy... or bafk... etc (base32 / base58btc encoded)
  if (/^(bafy|bafk|bafyb|bafkreig|b[a-z2-7]{58,})[a-z2-7A-Z0-9]*$/.test(cid)) return true;
  // Permissive fallback: starts with b or Q, 46–100 chars, alphanum
  return /^[Qb][a-zA-Z0-9]{45,99}$/.test(cid);
}
