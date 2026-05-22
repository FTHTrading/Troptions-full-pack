---
title: Operator seed and partner rails
layout: default
permalink: /technical/OPERATOR_SEED_AND_PARTNER.html
---

# Operator seed and partner rails

**Audience:** Operator on the Windows host — not investors. **No secrets** in this document or in git.

## Tonight (operator checklist)

1. **Clone / pull** `Troptions-full-pack` on the operator machine.
2. **Copy env:** `cp config/multi-gateway.env.template .env` (or merge into existing root `.env`).
3. **XRPL seed (host only):** Set `XRPL_SEED` in `.env` from your secure vault — never commit, never paste into chat or Cursor output.
4. **Issuer address (public):** XRPL issuer `rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ` — verify on [XRPScan](https://xrpscan.com/account/rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ).
5. **PM2 floor:** `pm2 start ecosystem.config.js --only payment-orchestrator,compliance-engine,swift-bridge,fedwire-adapter,baas-api`
6. **Health:** `curl http://127.0.0.1:4022/health` (orchestrator), `:4024` (swift-bridge), `:8097` (baas-api).
7. **Wire test:** Only after partner omnibus + counsel sign-off — otherwise dry-run stubs only (**PIPELINE**).

Telegram: `TELEGRAM_BOT_TOKEN` in `.env` only — see [TELEGRAM_OPERATOR.html](TELEGRAM_OPERATOR.html).

Investor pages (no secrets): [Command Center](https://fthtrading.github.io/Troptions-full-pack/command-center/), [Overview](https://fthtrading.github.io/Troptions-full-pack/overview/), [Institutional rails](https://fthtrading.github.io/Troptions-full-pack/swift/).

## Safe Cursor prompt — find XRPL seed **paths only**

Use this in Cursor **yourself** (operator). Do **not** ask an agent to scan all of `C:\Users\Kevan`.

**Rules:**

- Output **file paths only** — never print seed words or `XRPL_SEED=` values.
- Scope search to: repo `Troptions-full-pack`, optional `OneDrive` subtree, and known config names.
- Search for issuer address `rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ` or env key `XRPL_SEED` — report paths, not matching lines.

**Prompt (copy/paste):**

```text
Find where XRPL_SEED or the issuer rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ is referenced in this workspace.

Rules:
- Search only: Troptions-full-pack repo and optionally C:\Users\Kevan\OneDrive (not entire C:\Users\Kevan).
- Return a markdown table: path | why it matters (e.g. .env.example template, docs, script).
- NEVER print seed content, sEd… values, or lines containing XRPL_SEED=.
- If a file is .env or contains secrets, list the path only and say "operator local — do not commit".
```

**PowerShell (paths only, repo + OneDrive):**

```powershell
$roots = @(
  "C:\Users\Kevan\Troptions-full-pack",
  "C:\Users\Kevan\OneDrive"
)
$patterns = "XRPL_SEED", "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ"
foreach ($root in $roots) {
  if (-not (Test-Path $root)) { continue }
  foreach ($pat in $patterns) {
    Get-ChildItem $root -Recurse -File -ErrorAction SilentlyContinue |
      Where-Object {
        $_.FullName -notmatch '\\node_modules\\|\\.git\\|\\.next\\' -and
        $_.Extension -match '\.(env|example|md|ps1|js|ts|json|template|cjs)$'
      } |
      Select-String -Pattern $pat -List -ErrorAction SilentlyContinue |
      ForEach-Object { $_.Path }
  }
}
```

Review listed paths manually on the operator host. Rotate seed if it ever appeared in chat, email, or a committed file.

## Partner rails (PIPELINE)

| Port | Service | Until live |
|------|---------|------------|
| :4022 | payment-orchestrator | Bank webhook + compliance pass |
| :4023 | fedwire-adapter | Partner FedWire routing |
| :4024 | swift-bridge | BIC + RMA + bureau |
| :4025 | compliance-engine | OFAC/KYC keys in .env |

Full diligence table: [Investor /swift/](https://fthtrading.github.io/Troptions-full-pack/swift/).

## Honesty

- **PROVEN:** Code, public issuer address, ledger issuance totals in proof docs.
- **PIPELINE:** Fiat adapters, omnibus, MT103/FedWire production.
- **PROJECTION:** Revenue scripts ($825/hour, $874K/month) — not guaranteed deposits.
