/**
 * Treasury Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * Aggregates the canonical TREASURY_TOPOLOGY (11 XRPL + 35 Stellar wallet
 * roles) with live on-chain queries to produce a unified treasury snapshot.
 *
 * SAFETY:
 *   - Read-only. Never signs, never broadcasts.
 *   - Pending-generation roles are returned with status info but no chain query.
 *   - Compromised wallets are flagged and excluded from operational totals.
 *
 * USAGE:
 *   import { getTreasurySnapshot } from "@/lib/troptions/treasuryEngine";
 *   const snap = await getTreasurySnapshot();
 */

import {
  TREASURY_TOPOLOGY,
  summariseTopology,
  type TreasuryWalletRole,
  type TreasuryProvisionStatus,
} from "@/content/troptions/treasuryTopologyRegistry";
import { getXrplAccountLive, getXrplTrustlinesLive, type XrplLiveTrustline } from "@/lib/troptions/xrplLedgerEngine";
import { getStellarAccountLive, type StellarLiveBalance } from "@/lib/troptions/stellarLedgerEngine";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RoleSnapshotXrpl {
  readonly chain: "xrpl";
  readonly role: TreasuryWalletRole;
  readonly liveStatus: "live" | "not-funded" | "pending" | "skipped" | "error";
  readonly nativeBalance?: string;
  readonly trustlines?: readonly XrplLiveTrustline[];
  readonly trustlineCount?: number;
  readonly error?: string;
  readonly queriedAt: string;
}

export interface RoleSnapshotStellar {
  readonly chain: "stellar";
  readonly role: TreasuryWalletRole;
  readonly liveStatus: "live" | "not-funded" | "pending" | "skipped" | "error";
  readonly nativeBalance?: string;
  readonly balances?: readonly StellarLiveBalance[];
  readonly trustlineCount?: number;
  readonly error?: string;
  readonly queriedAt: string;
}

export type RoleSnapshot = RoleSnapshotXrpl | RoleSnapshotStellar;

export interface TreasurySnapshot {
  readonly generatedAt: string;
  readonly topology: ReturnType<typeof summariseTopology>;
  readonly roles: readonly RoleSnapshot[];
  readonly aggregates: {
    readonly totalRolesQueried: number;
    readonly totalRolesLive: number;
    readonly totalRolesPending: number;
    readonly totalRolesError: number;
    readonly xrpTotal: string;
    readonly xlmTotal: string;
    readonly troptionsXrplTotal: string;
    readonly troptionsStellarTotal: string;
  };
  readonly alerts: readonly {
    readonly severity: "info" | "warn" | "critical";
    readonly roleId?: string;
    readonly message: string;
  }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shouldQueryLive(status: TreasuryProvisionStatus): boolean {
  return status === "active" || status === "configured";
}

function addDecimalStrings(a: string, b: string): string {
  // Sufficient for typical XRP/XLM balances — uses Number; values << 2^53.
  const result = Number(a || "0") + Number(b || "0");
  return result.toFixed(6);
}

const TROPTIONS_CURRENCY_HEX = "54524F5054494F4E530000000000000000000000";

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Build a full live treasury snapshot.
 * - For active/configured roles with a known address → query live state.
 * - For pending-generation roles → return placeholder snapshot.
 *
 * All queries run in parallel, with a per-role try/catch so one failure
 * doesn't poison the whole snapshot.
 */
export async function getTreasurySnapshot(): Promise<TreasurySnapshot> {
  const generatedAt = new Date().toISOString();

  const snapshots = await Promise.all(
    TREASURY_TOPOLOGY.map(async (role): Promise<RoleSnapshot> => {
      const queriedAt = new Date().toISOString();

      if (!shouldQueryLive(role.status)) {
        return role.chain === "xrpl"
          ? { chain: "xrpl", role, liveStatus: "pending", queriedAt }
          : { chain: "stellar", role, liveStatus: "pending", queriedAt };
      }

      if (!role.address) {
        return role.chain === "xrpl"
          ? { chain: "xrpl", role, liveStatus: "skipped", queriedAt, error: "No address configured (seed env var unset)" }
          : { chain: "stellar", role, liveStatus: "skipped", queriedAt, error: "No address configured (seed env var unset)" };
      }

      try {
        if (role.chain === "xrpl") {
          const acc = await getXrplAccountLive(role.address);
          if (acc.error) {
            // actNotFound = unfunded — treat as not-funded, not error.
            const isNotFunded = /actNotFound|Account not found/i.test(acc.error);
            return {
              chain: "xrpl",
              role,
              liveStatus: isNotFunded ? "not-funded" : "error",
              error: acc.error,
              queriedAt,
            };
          }
          let trustlines: readonly XrplLiveTrustline[] = [];
          try {
            trustlines = await getXrplTrustlinesLive(role.address);
          } catch {
            // trustlines are optional — don't fail the role
          }
          return {
            chain: "xrpl",
            role,
            liveStatus: "live",
            nativeBalance: acc.xrpBalance,
            trustlines,
            trustlineCount: trustlines.length,
            queriedAt,
          };
        }

        // Stellar
        const acc = await getStellarAccountLive(role.address);
        if (acc.error) {
          const isNotFunded = /not_found|404/i.test(acc.error);
          return {
            chain: "stellar",
            role,
            liveStatus: isNotFunded ? "not-funded" : "error",
            error: acc.error,
            queriedAt,
          };
        }
        const trustlineCount = acc.balances.filter((b) => b.assetType !== "native").length;
        return {
          chain: "stellar",
          role,
          liveStatus: "live",
          nativeBalance: acc.xlmBalance,
          balances: acc.balances,
          trustlineCount,
          queriedAt,
        };
      } catch (err) {
        return role.chain === "xrpl"
          ? { chain: "xrpl", role, liveStatus: "error", error: err instanceof Error ? err.message : String(err), queriedAt }
          : { chain: "stellar", role, liveStatus: "error", error: err instanceof Error ? err.message : String(err), queriedAt };
      }
    }),
  );

  // ── Aggregates ──────────────────────────────────────────────────────────────
  let xrpTotal = "0";
  let xlmTotal = "0";
  let troptionsXrplTotal = "0";
  let troptionsStellarTotal = "0";
  let live = 0;
  let pending = 0;
  let errored = 0;

  for (const s of snapshots) {
    if (s.liveStatus === "live") live++;
    else if (s.liveStatus === "pending") pending++;
    else if (s.liveStatus === "error") errored++;

    if (s.chain === "xrpl" && s.liveStatus === "live") {
      if (s.nativeBalance) xrpTotal = addDecimalStrings(xrpTotal, s.nativeBalance);
      if (s.trustlines) {
        for (const tl of s.trustlines) {
          if (tl.currency === TROPTIONS_CURRENCY_HEX || tl.currency === "TROPTIONS") {
            troptionsXrplTotal = addDecimalStrings(troptionsXrplTotal, tl.balance);
          }
        }
      }
    } else if (s.chain === "stellar" && s.liveStatus === "live") {
      if (s.nativeBalance) xlmTotal = addDecimalStrings(xlmTotal, s.nativeBalance);
      if (s.balances) {
        for (const b of s.balances) {
          if (b.assetCode === "TROPTIONS") {
            troptionsStellarTotal = addDecimalStrings(troptionsStellarTotal, b.balance);
          }
        }
      }
    }
  }

  // ── Alerts ──────────────────────────────────────────────────────────────────
  const alerts: Array<{
    severity: "info" | "warn" | "critical";
    roleId?: string;
    message: string;
  }> = [];
  for (const s of snapshots) {
    if (s.role.status === "compromised") {
      alerts.push({
        severity: "critical",
        roleId: s.role.roleId,
        message: `Compromised role still in topology: ${s.role.displayName}`,
      });
    }
    if (s.liveStatus === "error") {
      alerts.push({
        severity: "warn",
        roleId: s.role.roleId,
        message: `Live query failed for ${s.role.displayName}: ${s.error ?? "unknown"}`,
      });
    }
    if (s.liveStatus === "not-funded" && s.role.status === "active") {
      alerts.push({
        severity: "warn",
        roleId: s.role.roleId,
        message: `Active role not funded on-chain: ${s.role.displayName}`,
      });
    }
  }
  if (pending > 0) {
    alerts.push({
      severity: "info",
      message: `${pending} role(s) pending fresh wallet generation. Board authorization + legal review required before activation.`,
    });
  }

  return {
    generatedAt,
    topology: summariseTopology(),
    roles: snapshots,
    aggregates: {
      totalRolesQueried: snapshots.length,
      totalRolesLive: live,
      totalRolesPending: pending,
      totalRolesError: errored,
      xrpTotal,
      xlmTotal,
      troptionsXrplTotal,
      troptionsStellarTotal,
    },
    alerts,
  };
}

/**
 * Lightweight snapshot — topology + status only, no live chain queries.
 * Useful for fast UI bootstrapping.
 */
export function getTreasuryTopologySnapshot() {
  return {
    generatedAt: new Date().toISOString(),
    topology: summariseTopology(),
    roles: TREASURY_TOPOLOGY,
  };
}
