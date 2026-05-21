"use client";
// TROPTIONS Exchange OS — Horizon-style XRPL live token market table

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface XrplMarketToken {
  currency: string;
  currencyHex: string;
  issuer: string;
  name: string;
  icon: string | null;
  dex: string;
  price: number;
  change5m: number;
  change1h: number;
  change24h: number;
  change7d: number;
  volume24h: number;
  volume7d: number;
  marketCap: number;
  liquidity: number;
  holders: number;
}

type SortKey =
  | "change24h"
  | "volume24h"
  | "price"
  | "holders";

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtUsd(raw: number | null | undefined): string {
  const n = typeof raw === "number" && isFinite(raw) ? raw : 0;
  if (n === 0) return "—";
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

function fmtPrice(raw: number | null | undefined): string {
  const n = typeof raw === "number" && isFinite(raw) ? raw : null;
  if (n === null || n === 0) return "—";
  if (n >= 1) return `$${n.toFixed(4)}`;
  if (n < 0.000001) return `$${n.toExponential(2)}`;
  return `$${n.toFixed(6)}`;
}

function fmtHolders(raw: number | null | undefined): string {
  const n = typeof raw === "number" && isFinite(raw) ? raw : 0;
  if (n === 0) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TokenIcon({ token }: { token: XrplMarketToken }) {
  const [errored, setErrored] = useState(false);
  const initials = String(token.name || token.currency || "?").slice(0, 2).toUpperCase();

  if (token.icon && !errored) {
    return (
      <Image
        src={token.icon}
        alt={token.currency}
        width={28}
        height={28}
        onError={() => setErrored(true)}
        style={{
          borderRadius: "50%",
          objectFit: "cover",
          background: "var(--xos-surface-2)",
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: "var(--xos-surface-2)",
        border: "1px solid var(--xos-border-1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: "0.6rem",
        fontWeight: 800,
        color: "var(--xos-gold)",
        letterSpacing: "0.02em",
      }}
    >
      {initials}
    </div>
  );
}

function PctCell({ v }: { v: number }) {
  const isPositive = v > 0;
  const isZero = v === 0;
  return (
    <td
      style={{
        textAlign: "right",
        padding: "0.35rem 0.5rem",
        fontSize: "0.78rem",
        color: isZero
          ? "var(--xos-text-muted)"
          : isPositive
          ? "var(--xos-green)"
          : "var(--xos-red)",
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
      }}
    >
      {isZero ? "0.0%" : `${isPositive ? "+" : ""}${v.toFixed(1)}%`}
    </td>
  );
}

function SortHeader({
  label,
  col,
  currentSort,
  dir,
  onSort,
}: {
  label: string;
  col: SortKey;
  currentSort: SortKey;
  dir: "asc" | "desc";
  onSort: (k: SortKey) => void;
}) {
  const active = currentSort === col;
  return (
    <th
      onClick={() => onSort(col)}
      style={{
        cursor: "pointer",
        whiteSpace: "nowrap",
        padding: "0.45rem 0.5rem",
        color: active ? "var(--xos-gold)" : "var(--xos-text-muted)",
        fontSize: "0.68rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        textAlign: "right",
        userSelect: "none",
        transition: "color 0.15s",
      }}
    >
      {label}
      {active ? (
        <span style={{ marginLeft: 3, opacity: 0.8 }}>
          {dir === "desc" ? "▼" : "▲"}
        </span>
      ) : (
        <span style={{ marginLeft: 3, opacity: 0.25 }}>⇅</span>
      )}
    </th>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr style={{ borderBottom: "1px solid var(--xos-border-0)" }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} style={{ padding: "0.55rem 0.5rem" }}>
          <div
            style={{
              height: 14,
              borderRadius: 4,
              background: "var(--xos-surface-2)",
              width: i === 0 ? 140 : i === 1 ? 40 : 56,
              opacity: 0.5,
              animation: "xos-pulse 1.6s ease-in-out infinite",
            }}
          />
        </td>
      ))}
    </tr>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function XrplMarketsTable() {
  const [tokens, setTokens] = useState<XrplMarketToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("volume24h");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [watchlist] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<"all" | "watchlist">("all");
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await fetch(
        "/exchange-os/api/xrpl/markets?sort=volume_24h&limit=100",
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTokens(data.tokens ?? []);
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: initial async fetch triggers state update
    void load(false);
    refreshTimer.current = setInterval(() => void load(true), 30_000);
    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current);
    };
  }, [load]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const q = search.trim().toLowerCase();
  const filtered = tokens
    .filter((t) => {
      if (tab === "watchlist") return watchlist.has(`${t.currency}:${t.issuer}`);
      if (!q) return true;
      return (
        t.currency.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.issuer.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const va = (a as unknown as Record<string, number>)[sortKey] ?? 0;
      const vb = (b as unknown as Record<string, number>)[sortKey] ?? 0;
      return sortDir === "desc" ? vb - va : va - vb;
    });

  const sortProps = { currentSort: sortKey, dir: sortDir, onSort: handleSort };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* ── Controls bar ── */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--xos-text-muted)",
              fontSize: "0.9rem",
              pointerEvents: "none",
            }}
          >
            ⌕
          </span>
          <input
            className="xos-input"
            placeholder="Search name, ticker or issuer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 30, width: "100%" }}
          />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {(["all", "watchlist"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setTab(f)}
              className={`xos-btn xos-btn--sm ${
                tab === f ? "xos-btn--primary" : "xos-btn--ghost"
              }`}
            >
              {f === "all" ? "All Tokens" : "Watchlist"}
            </button>
          ))}
        </div>

        {/* Live indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.7rem",
            color: "var(--xos-text-muted)",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: error ? "var(--xos-red)" : "var(--xos-green)",
              display: "inline-block",
              boxShadow: error
                ? "0 0 4px var(--xos-red)"
                : "0 0 4px var(--xos-green)",
            }}
          />
          {error
            ? "Error"
            : lastUpdated
            ? `Updated ${lastUpdated.toLocaleTimeString()}`
            : "Loading…"}
        </div>
      </div>

      {/* ── Table ── */}
      <div
        style={{
          overflowX: "auto",
          borderRadius: "var(--xos-radius-lg)",
          border: "1px solid var(--xos-border-1)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.82rem",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--xos-border-1)",
                background: "var(--xos-surface-2)",
              }}
            >
              <th
                style={{
                  padding: "0.45rem 0.75rem",
                  textAlign: "left",
                  color: "var(--xos-text-muted)",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  whiteSpace: "nowrap",
                  minWidth: 200,
                }}
              >
                Token
              </th>
              <th
                style={{
                  padding: "0.45rem 0.5rem",
                  color: "var(--xos-text-muted)",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  textAlign: "center",
                }}
              >
                Trade
              </th>
              <SortHeader label="24h %" col="change24h" {...sortProps} />
              <SortHeader label="24h Vol" col="volume24h" {...sortProps} />
              <SortHeader label="Price" col="price" {...sortProps} />
              <SortHeader label="Holders" col="holders" {...sortProps} />
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 15 }).map((_, i) => <SkeletonRow key={i} />)
            ) : error ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "3rem",
                    textAlign: "center",
                    color: "var(--xos-red)",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>⚠</div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    Market data unavailable
                  </div>
                  <div style={{ fontSize: "0.78rem", opacity: 0.7 }}>
                    {error}
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "3rem",
                    textAlign: "center",
                    color: "var(--xos-text-muted)",
                  }}
                >
                  No tokens match your search.
                </td>
              </tr>
            ) : (
              filtered.map((token, i) => (
                <tr
                  key={`${token.currencyHex}-${token.issuer}-${i}`}
                  style={{
                    borderBottom: "1px solid var(--xos-border-0)",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "var(--xos-surface-1)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "")
                  }
                >
                  {/* Token */}
                  <td style={{ padding: "0.45rem 0.75rem", minWidth: 200 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.55rem",
                      }}
                    >
                      <TokenIcon token={token} />
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "var(--xos-text)",
                            fontSize: "0.82rem",
                            lineHeight: 1.2,
                          }}
                        >
                          <Link
                            href={`/exchange-os/token/${encodeURIComponent(token.currency)}?issuer=${encodeURIComponent(token.issuer)}`}
                            style={{ color: "inherit", textDecoration: "none" }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--xos-cyan)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "inherit")}
                          >
                            {token.name || token.currency}
                          </Link>
                        </div>
                        <div
                          style={{
                            color: "var(--xos-text-subtle)",
                            fontSize: "0.68rem",
                            letterSpacing: "0.02em",
                          }}
                        >
                          ${token.currency}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Trade button */}
                  <td
                    style={{
                      padding: "0.35rem 0.5rem",
                      textAlign: "center",
                    }}
                  >
                    <Link
                      href={`/exchange-os/trade?from=XRP&to=${encodeURIComponent(
                        token.currency
                      )}&issuer=${encodeURIComponent(token.issuer)}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0.15rem 0.55rem",
                        fontSize: "0.7rem",
                        borderRadius: "var(--xos-radius)",
                        background: "transparent",
                        border: "1px solid var(--xos-border-1)",
                        color: "var(--xos-cyan)",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        transition: "border-color 0.15s, background 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "var(--xos-cyan)";
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(0,212,255,0.07)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "var(--xos-border-1)";
                        (e.currentTarget as HTMLElement).style.background =
                          "transparent";
                      }}
                    >
                      Trade ⟷
                    </Link>
                  </td>

                  {/* 24h change */}
                  <PctCell v={token.change24h} />

                  {/* 24h Volume */}
                  <td
                    style={{
                      textAlign: "right",
                      padding: "0.35rem 0.5rem",
                      color: "var(--xos-text)",
                      fontSize: "0.78rem",
                      fontVariantNumeric: "tabular-nums",
                      fontWeight: 600,
                    }}
                  >
                    {fmtUsd(token.volume24h)}
                  </td>

                  {/* Price */}
                  <td
                    style={{
                      textAlign: "right",
                      padding: "0.35rem 0.5rem",
                      color: "var(--xos-cyan)",
                      fontSize: "0.78rem",
                      fontFamily: "monospace",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {fmtPrice(token.price)}
                  </td>

                  {/* Holders */}
                  <td
                    style={{
                      textAlign: "right",
                      padding: "0.35rem 0.5rem",
                      color: "var(--xos-text-muted)",
                      fontSize: "0.78rem",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {fmtHolders(token.holders)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.7rem",
          color: "var(--xos-text-subtle)",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <span>
          {loading ? "Loading…" : `${filtered.length} tokens`} · Source:{" "}
          <a
            href="https://xrplmeta.org"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--xos-gold-muted)", textDecoration: "none" }}
          >
            xrplmeta.org
          </a>
        </span>
        <span>Auto-refreshes every 30 s · All prices in USD</span>
      </div>
    </div>
  );
}
