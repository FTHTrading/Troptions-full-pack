#!/usr/bin/env python3
"""Sync PM2 port table in docs/technical/SYSTEM_MANIFEST.md from ecosystem.config.js."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ECOSYSTEM = ROOT / "ecosystem.config.js"
MANIFEST = ROOT / "docs" / "technical" / "SYSTEM_MANIFEST.md"

KNOWN = {
    "troptions-l1-node": ("9944", "l1/", "PROVEN", "Rust L1; metrics :9945"),
    "donk-ai-tutor": ("8090", "ai/donk-tutor/", "PROVEN", "RAG + Ollama"),
    "fth-backend": ("8091", "backend/fth-academy/", "PROVEN", "Academy API + Stripe patterns"),
    "ttn-launcher": ("8092", "backend/ttn-launcher/", "PROVEN", "TTN / sports backend"),
    "dao-service": ("8093", "backend/dao-service/", "PROVEN", "Governance API"),
    "x402-gateway": ("4020", "backend/x402-gateway/", "PROVEN", "Metered ATP sidecar"),
    "popeye-relay": ("4021", "backend/popeye-relay/", "PROVEN", "Stale agent relay"),
    "payment-orchestrator": ("4022", "fiat-rails/payment-orchestrator/", "PIPELINE", "Hybrid fiat/crypto routing stub"),
    "fedwire-adapter": ("4023", "fiat-rails/fedwire-adapter/", "PIPELINE", "FedWire RTGS adapter stub"),
    "swift-bridge": ("4024", "fiat-rails/swift-bridge/", "PIPELINE", "MT103/202 messaging stub"),
    "compliance-engine": ("4025", "fiat-rails/compliance-engine/", "PIPELINE", "AML/KYC/OFAC stub (was msb-compliance :4098)"),
    "neobank-api": ("4026", "fiat-rails/neobank-api/", "PROJECTION", "Neobank API design stub"),
    "iou-reserve-monitor": ("4027", "fiat-rails/iou-reserve-monitor/", "PIPELINE", "Omnibus vs ledger reconciliation stub"),
}

START = "<!-- AUTO:PM2_PORTS_START -->"
END = "<!-- AUTO:PM2_PORTS_END -->"


def parse_ecosystem_names() -> list[str]:
    if not ECOSYSTEM.exists():
        return list(KNOWN.keys())
    text = ECOSYSTEM.read_text(encoding="utf-8")
    names = re.findall(r'name:\s*"([^"]+)"', text)
    ordered: list[str] = []
    for n in names:
        if n not in ordered:
            ordered.append(n)
    for k in KNOWN:
        if k not in ordered:
            ordered.append(k)
    return ordered


def port_row(name: str) -> str:
    port, path, label, notes = KNOWN.get(
        name,
        ("TBD", f"fiat-rails/{name}/", "PIPELINE", "See ecosystem.config.js"),
    )
    if name == "troptions-l1-node":
        port = "**9944** (RPC), **9945** (`/metrics`)"
    else:
        port = f"**{port}**"
    return f"| `{name}` | {port} | **{label}** | `{path}` | {notes} |"


def build_table() -> str:
    lines = [
        "| PM2 name | Port | Label | Path | Notes |",
        "|----------|------|-------|------|-------|",
    ]
    for name in parse_ecosystem_names():
        lines.append(port_row(name))
    return "\n".join(lines)


def patch_manifest(table: str) -> bool:
    if not MANIFEST.exists():
        print(f"Missing {MANIFEST}")
        return False
    text = MANIFEST.read_text(encoding="utf-8")
    if START not in text or END not in text:
        print("AUTO markers missing in SYSTEM_MANIFEST.md")
        return False
    pattern = re.compile(re.escape(START) + r".*?" + re.escape(END), re.DOTALL)
    replacement = f"{START}\n{table}\n{END}"
    new_text = pattern.sub(replacement, text, count=1)
    if new_text == text:
        print("PM2 table unchanged")
        return True
    MANIFEST.write_text(new_text, encoding="utf-8")
    print(f"Updated PM2 table in {MANIFEST.relative_to(ROOT)}")
    return True


def main() -> int:
    table = build_table()
    ok = patch_manifest(table)
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
