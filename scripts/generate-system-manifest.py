#!/usr/bin/env python3
"""Sync PM2 port table in docs/technical/SYSTEM_MANIFEST.md from ecosystem.config.js."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ECOSYSTEM = ROOT / "ecosystem.config.js"
MANIFEST = ROOT / "docs" / "technical" / "SYSTEM_MANIFEST.md"

# PM2 apps: name -> (port env keys, default port, path hint, label, notes)
KNOWN = {
    "troptions-l1-node": ("9944", "l1/", "PROVEN", "Rust L1; metrics :9945"),
    "donk-ai-tutor": ("8090", "ai/donk-tutor/", "PROVEN", "RAG + Ollama"),
    "fth-backend": ("8091", "backend/fth-academy/", "PROVEN", "Academy API + Stripe patterns"),
    "ttn-launcher": ("8092", "backend/ttn-launcher/", "PROVEN", "TTN / sports backend"),
    "dao-service": ("8093", "backend/dao-service/", "PROVEN", "Governance API"),
    "x402-gateway": ("4020", "backend/x402-gateway/", "PROVEN", "Metered ATP sidecar"),
    "popeye-relay": ("4021", "backend/popeye-relay/", "PROVEN", "Stale agent relay"),
    "payment-orchestrator": ("4022", "backend/payment-orchestrator/", "PIPELINE", "Fiat/crypto routing stub; autorestart: false"),
    "msb-compliance": ("4098", "backend/msb-compliance/", "PIPELINE", "AML/KYC/OFAC stub; autorestart: false"),
    "swift-bridge": ("(container)", "backend/swift-bridge/ (planned)", "PIPELINE", "MT103/202 — container TBD"),
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
        if k not in ordered and k != "swift-bridge":
            ordered.append(k)
    if "swift-bridge" not in ordered:
        ordered.append("swift-bridge")
    return ordered


def port_row(name: str) -> str:
    port, path, label, notes = KNOWN.get(
        name,
        ("TBD", f"backend/{name}/", "PIPELINE", "See ecosystem.config.js"),
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
    eco_text = ECOSYSTEM.read_text(encoding="utf-8") if ECOSYSTEM.exists() else ""
    for name in parse_ecosystem_names():
        if name == "swift-bridge" and 'name: "swift-bridge"' not in eco_text:
            lines.append(port_row(name))
            continue
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


def list_technical_md() -> list[str]:
    tech = ROOT / "docs" / "technical"
    return sorted(p.relative_to(ROOT).as_posix() for p in tech.rglob("*.md") if "_includes" not in p.parts)


def main() -> int:
    table = build_table()
    ok = patch_manifest(table)
    print(f"Technical markdown files: {len(list_technical_md())}")
    for rel in list_technical_md():
        if "SYSTEM_MANIFEST" in rel or "MSB_FIAT" in rel:
            print(f"  {rel}")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
