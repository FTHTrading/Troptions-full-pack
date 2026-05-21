#!/usr/bin/env python3
"""Sync PM2 port table and IOU revenue section in docs/technical/SYSTEM_MANIFEST.md."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ECOSYSTEM = ROOT / "ecosystem.config.js"
MANIFEST = ROOT / "docs" / "technical" / "SYSTEM_MANIFEST.md"
IOU_MANIFEST = ROOT / "docs" / "TROPTIONS_IOU_ISSUER_MANIFEST.md"

KNOWN = {
    "troptions-l1-node": ("9944", "l1/", "PROVEN", "Rust L1; metrics :9945"),
    "donk-ai-tutor": ("8090", "ai/donk-tutor/", "PROVEN", "RAG + Ollama"),
    "fth-backend": ("8091", "backend/fth-academy/", "PROVEN", "Academy API + Stripe patterns"),
    "ttn-launcher": ("8092", "backend/ttn-launcher/", "PROVEN", "TTN / sports backend"),
    "dao-service": ("8093", "backend/dao-service/", "PROVEN", "Governance API"),
    "x402-gateway": ("4020", "backend/x402-gateway/", "PROVEN", "Metered ATP sidecar"),
    "popeye-relay": ("4021", "backend/popeye-relay/", "PROVEN", "Stale agent relay"),
    "payment-orchestrator": (
        "4022",
        "fiat-rails/orchestrator/",
        "PIPELINE",
        "Wire → IOU (`POST /api/v1/payments/wire`)",
    ),
    "fedwire-adapter": ("4023", "fiat-rails/fedwire-adapter/", "PIPELINE", "FedWire RTGS adapter stub"),
    "swift-bridge": ("4024", "fiat-rails/swift-bridge/", "PIPELINE", "MT103/202 messaging stub"),
    "compliance-engine": ("4025", "fiat-rails/compliance-engine/", "PIPELINE", "AML/KYC/OFAC stub"),
    "neobank-api": ("4026", "fiat-rails/neobank-api/", "PROJECTION", "Neobank API design stub"),
    "iou-reserve-monitor": (
        "4027",
        "fiat-rails/iou-reserve-monitor/",
        "PIPELINE",
        "Omnibus vs ledger reconciliation stub",
    ),
    "arbitrage-bot": (
        "4028",
        "fiat-rails/arbitrage-bot/",
        "PIPELINE",
        "Cross-bank arbitrage watch loop (`DRY_RUN` default)",
    ),
    "baas-api": (
        "8097",
        "fiat-rails/baas-api/",
        "PROJECTION",
        "BaaS x402 onboarding + revenue dashboard stubs",
    ),
}

PM2_START = "<!-- AUTO:PM2_PORTS_START -->"
PM2_END = "<!-- AUTO:PM2_PORTS_END -->"
IOU_START = "<!-- AUTO:IOU_REVENUE_START -->"
IOU_END = "<!-- AUTO:IOU_REVENUE_END -->"


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


def build_pm2_table() -> str:
    lines = [
        "| PM2 name | Port | Label | Path | Notes |",
        "|----------|------|-------|------|-------|",
    ]
    for name in parse_ecosystem_names():
        lines.append(port_row(name))
    return "\n".join(lines)


def load_iou_body() -> str:
    if not IOU_MANIFEST.exists():
        raise FileNotFoundError(IOU_MANIFEST)
    text = IOU_MANIFEST.read_text(encoding="utf-8")
    lines = text.splitlines()
    if lines and lines[0].startswith("# "):
        lines = lines[1:]
    while lines and not lines[0].strip():
        lines.pop(0)
    return "\n".join(lines).strip()


def build_iou_section() -> str:
    body = load_iou_body()
    return (
        f"{IOU_START}\n"
        f"## 5. MSB / SWIFT / FedWire & IOU Revenue Model\n\n"
        f"*Auto-synced from `docs/TROPTIONS_IOU_ISSUER_MANIFEST.md` — do not edit between markers.*\n\n"
        f"{body}\n"
        f"{IOU_END}"
    )


def patch_block(text: str, start: str, end: str, replacement_inner: str) -> tuple[str, bool]:
    if start not in text or end not in text:
        return text, False
    pattern = re.compile(re.escape(start) + r".*?" + re.escape(end), re.DOTALL)
    replacement = f"{start}\n{replacement_inner}\n{end}"
    new_text = pattern.sub(replacement, text, count=1)
    return new_text, new_text != text


def main() -> int:
    if not MANIFEST.exists():
        print(f"Missing {MANIFEST}")
        return 1

    text = MANIFEST.read_text(encoding="utf-8")
    changed = False

    pm2_table = build_pm2_table()
    text, pm2_changed = patch_block(text, PM2_START, PM2_END, pm2_table)
    if pm2_changed:
        print(f"Updated PM2 table in {MANIFEST.relative_to(ROOT)}")
        changed = True
    else:
        print("PM2 table unchanged")

    iou_inner = build_iou_section().removeprefix(IOU_START + "\n").removesuffix("\n" + IOU_END)
    text, iou_changed = patch_block(text, IOU_START, IOU_END, iou_inner)
    if iou_changed:
        print(f"Updated IOU section in {MANIFEST.relative_to(ROOT)}")
        changed = True
    elif IOU_START not in text:
        insert = f"\n\n{build_iou_section()}\n\n---\n\n"
        if PM2_END in text:
            text = text.replace(PM2_END, PM2_END + insert, 1)
            print("Inserted IOU section after PM2 table")
            changed = True
        else:
            print("IOU markers missing and PM2_END not found")
            return 1
    else:
        print("IOU section unchanged")

    if changed:
        MANIFEST.write_text(text, encoding="utf-8")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
