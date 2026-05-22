# Copy investor PDF HTML to docs/technical/*.html and generate MD companions for GitHub Pages.
param(
    [switch]$SkipMarkdown
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Docs = Join-Path $Root "docs"
$Technical = Join-Path $Docs "technical"
$Downloads = Join-Path $Docs "downloads"

$copyMap = @{
    "VALUATION_AND_COMPARABLES.html" = "valuation-and-comparables.html"
    "ON_CHAIN_PROOF.html"            = "on-chain-proof-sheet.html"
    "ECOSYSTEM_MAP.html"             = "infrastructure-atlas.html"
}

function Fix-PrintHtml {
    param([string]$Content, [string]$DepthPrefix)
    $css = "${DepthPrefix}downloads/print-shared.css"
    $content = $Content -replace 'href="print-shared\.css"', "href=`"$css`""
    $nav = @"
  <nav class="site-nav no-print" style="margin-bottom:1rem;font-size:0.75rem;display:flex;flex-wrap:wrap;gap:0.5rem 0.75rem">
    <a href="https://fthtrading.github.io/Troptions-full-pack/">Investor</a>
    <a href="https://fthtrading.github.io/Troptions-full-pack/technical/index.html">Docs hub</a>
  </nav>
"@
    if ($content -notmatch "site-nav") {
        $content = $content -replace "(<body[^>]*>)", "`$1`n$nav"
    }
    return $content
}

Write-Host "Syncing technical HTML for GitHub Pages..." -ForegroundColor Cyan

foreach ($destName in $copyMap.Keys) {
    $srcName = $copyMap[$destName]
    $src = Join-Path $Downloads $srcName
    if (-not (Test-Path $src)) {
        $src = Join-Path $Technical "investor-pdf\$srcName"
    }
    if (-not (Test-Path $src)) {
        Write-Warning "Missing source for $destName : $srcName"
        continue
    }
    $dest = Join-Path $Technical $destName
    $raw = Get-Content $src -Raw -Encoding UTF8
    $fixed = Fix-PrintHtml -Content $raw -DepthPrefix "../"
    Set-Content -Path $dest -Value $fixed -Encoding UTF8 -NoNewline
    Write-Host "  Copied $destName <- $srcName" -ForegroundColor DarkGray
}

if (-not $SkipMarkdown) {
    Write-Host "Generating HTML from technical markdown..." -ForegroundColor Cyan
    python (Join-Path $PSScriptRoot "md-to-technical-html.py")
    if ($LASTEXITCODE -ne 0) { throw "md-to-technical-html.py failed" }
}

# Hub index (regenerated each sync)
$hubPath = Join-Path $Technical "index.html"
$hub = @'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>TROPTIONS — Technical documentation</title>
  <link rel="stylesheet" href="../downloads/print-shared.css" />
</head>
<body>
  <nav class="site-nav no-print" style="margin-bottom:1rem;font-size:0.75rem;display:flex;flex-wrap:wrap;gap:0.5rem 0.75rem">
    <a href="https://fthtrading.github.io/Troptions-full-pack/">Investor</a>
    <a href="https://fthtrading.github.io/Troptions-full-pack/command-center/">Command Center</a>
    <a href="https://fthtrading.github.io/Troptions-full-pack/overview/">Overview</a>
    <a href="https://fthtrading.github.io/Troptions-full-pack/swift/">Institutional rails</a>
    <a href="https://github.com/FTHTrading/Troptions-full-pack">GitHub</a>
  </nav>
  <header class="doc-header">
    <h1>Technical documentation</h1>
    <p class="tagline">Static HTML on GitHub Pages — May 2026</p>
  </header>
  <h2>Operator hub (investor site)</h2>
  <ul>
    <li><a href="../overview/">What you can do NOW — capability matrix</a></li>
    <li><a href="../swift/">Institutional fiat rails (SWIFT · FedWire)</a></li>
    <li><a href="../command-center/">Command Center — ports, health, activation</a></li>
    <li><a href="../revenue/">Revenue engine summary (PROJECTION labeled)</a></li>
    <li><a href="../telegram/">Telegram bot setup</a></li>
    <li><a href="WHAT_YOU_CAN_DO_NOW.html">What you can do NOW (technical doc)</a></li>
    <li><a href="OPERATOR_SEED_AND_PARTNER.html">Operator seed + partner (paths only)</a></li>
  </ul>
  <h2>Banking &amp; system map (MSB / SWIFT / FedWire)</h2>
  <ul>
    <li><a href="TROPTIONS_REVENUE_ENGINE.html">TROPTIONS revenue engine (waves, 18 streams, flywheel)</a></li>
    <li><a href="SYSTEM_MANIFEST.html">System manifest (ports, rails, revenue labels)</a></li>
    <li><a href="MSB_FIAT_RAILS.html">MSB fiat rails (capitalization tree)</a></li>
    <li><a href="PARTNER_BANK_MESH.html">Partner bank mesh (multi-bank + Alexandrite)</a></li>
    <li><a href="ARBITRAGE_AND_BAAS.html">Arbitrage &amp; BaaS hub</a></li>
    <li><a href="X402_GLOBAL_MESH.html">x402 global mesh (US/EU/JP ports)</a></li>
    <li><a href="BAAS_BATCH_POOLS.html">BaaS batch liquidity pools</a></li>
    <li><a href="AGENTIC_RAG_AMM.html">Agentic RAG + AMM (orchestrator mesh)</a></li>
    <li><a href="TELEGRAM_OPERATOR.html">Telegram operator guide</a></li>
    <li><a href="AWS_ACTIVATION_RUNBOOK.html">AWS activation runbook</a></li>
  </ul>
  <h2>Investor diligence (primary)</h2>
  <ul>
    <li><a href="VALUATION_AND_COMPARABLES.html">Valuation &amp; comparables</a></li>
    <li><a href="ON_CHAIN_PROOF.html">On-chain proof registry</a></li>
    <li><a href="XRPL_STELLAR_VERIFICATION.html">XRPL &amp; Stellar verification</a></li>
    <li><a href="ECOSYSTEM_MAP.html">Ecosystem map (infrastructure atlas)</a></li>
    <li><a href="FINAL_ECOSYSTEM_AUDIT.html">Final ecosystem audit (9.8/10)</a></li>
    <li><a href="VERIFICATION_STATUS.html">Verification status</a></li>
    <li><a href="counterparty/PROOF_FOR_COUNTERPARTIES.html">Counterparty proof pack</a></li>
    <li><a href="GENESIS_POLYGON_CONTRACTS.html">Genesis Polygon contracts</a></li>
    <li><a href="TANTHEM_NFT_COLLECTION.html">TANTHEM NFT collection</a></li>
    <li><a href="MINT_DAPP_SECURITY.html">Mint DApp security</a></li>
    <li><a href="XRPL_NFT_MINT_RUNBOOK.html">XRPL NFT mint runbook</a></li>
  </ul>
  <h2>Downloads (print PDF)</h2>
  <ul>
    <li><a href="../downloads/investor-executive-summary.html">Executive summary</a></li>
    <li><a href="../downloads/on-chain-proof-sheet.html">On-chain proof sheet</a></li>
    <li><a href="../downloads/infrastructure-atlas.html">Infrastructure atlas</a></li>
    <li><a href="../downloads/opportunity-and-roadmap.html">Opportunity &amp; roadmap</a></li>
    <li><a href="../downloads/valuation-and-comparables.html">Valuation &amp; comparables</a></li>
    <li><a href="../downloads/INVESTOR_MASTER.pdf.html">Master pack (all sections)</a></li>
  </ul>
  <h2>Live surfaces</h2>
  <ul>
    <li><a href="../ecosystem/">Ecosystem status hub</a></li>
    <li><a href="../dao/">Sovereign DAO (public)</a></li>
    <li><a href="../mint.html">XRPL mint DApp</a></li>
    <li><a href="../nft/">NFT gallery</a></li>
    <li><a href="../">Investor site home</a></li>
  </ul>
  <h2>Governance</h2>
  <ul>
    <li><a href="DAO_ARCHITECTURE.html">Sovereign DAO architecture</a></li>
    <li><a href="DAO.html">DAO operator guide</a></li>
  </ul>
  <h2>Reference</h2>
  <ul>
    <li><a href="ARCHITECTURE.html">Architecture</a></li>
    <li><a href="QUICKSTART.html">Quickstart</a></li>
    <li><a href="DOMAIN_TRUTH_TABLE.html">Domain truth table</a></li>
    <li><a href="X402_AWS_VERIFICATION.html">x402 AWS verification</a></li>
    <li><a href="X402_INTEGRATION.html">x402 integration</a></li>
    <li><a href="X402_GLOBAL_MESH.html">x402 global mesh</a></li>
  </ul>
</body>
</html>
'@
Set-Content -Path $hubPath -Value $hub -Encoding UTF8
Write-Host "  technical/index.html (hub)" -ForegroundColor DarkGray

Write-Host "Done." -ForegroundColor Green
