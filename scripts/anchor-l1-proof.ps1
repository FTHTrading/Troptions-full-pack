# L1 anthem anchor — uses existing confirmed manifest or runs l1_anchor_v3.py
# Usage: .\scripts\anchor-l1-proof.ps1 [-RunMint]

$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

$confirmed = Join-Path $Root "TROPTIONS_L1_ANCHOR_CONFIRMED.json"
$manifest = Join-Path $Root "TROPTIONS_IPFS_CIDS.json"

if (Test-Path $confirmed) {
    $j = Get-Content $confirmed -Raw | ConvertFrom-Json
    Write-Host "CONFIRMED  L1 anchor already recorded" -ForegroundColor Green
    Write-Host "  status: $($j.l1_status)"
    Write-Host "  collection_hash: $($j.l1_proof.collection_hash)"
    Write-Host "  ipfs_manifest: $($j.credential.ipfs_manifest)"
    Write-Host "  file: TROPTIONS_L1_ANCHOR_CONFIRMED.json"
    Write-Host "  docs: docs/technical/ON_CHAIN_PROOF.md"
    if (-not $RunMint) { exit 0 }
}

if ($RunMint) {
    Write-Host "Running l1_anchor_v3.py (requires L1 RPC :9944)..."
    python (Join-Path $Root "scripts\l1_anchor_v3.py")
    exit $LASTEXITCODE
}

Write-Host "PENDING    No anchor file — run: python scripts/l1_anchor_v3.py"
Write-Host "           Or copy TROPTIONS_L1_ANCHOR_CONFIRMED.json from prior operator run."
