# Exchange OS verification — typecheck, lint, build, implementation report
$ErrorActionPreference = 'Continue'
$Repo = 'C:\Users\Kevan\troptions'
$log = Join-Path $Repo 'docs\EXCHANGE_OS_VERIFICATION_LOG.txt'
function L($m) { "$m" | Tee-Object -FilePath $log -Append; Write-Host $m }

Set-Location $Repo
L "=== Exchange OS Verification $(Get-Date -Format o) ==="

# --- Check which files actually exist ---
L "`n=== FILES CREATED BY PREVIOUS SESSION ==="
$checkPaths = @(
    'src\data\exchangeOsReadiness.ts',
    'src\data\solanaDexRegistry.ts',
    'src\app\exchange-os\readiness\page.tsx',
    'src\app\exchange-os\solana-dex-map\page.tsx',
    'src\app\api\exchange-os\readiness\route.ts',
    'src\app\api\exchange-os\solana-dex-map\route.ts',
    'src\components\exchange-os\ExchangeTruthBanner.tsx',
    'src\components\exchange-os\ReadinessCard.tsx',
    'src\components\exchange-os\LaunchGateChecklist.tsx',
    'docs\TROPTIONS_EXCHANGE_OS_GROWTH_PLAN.md',
    'docs\SOLANA_DEX_AND_LAUNCH_VENUE_MAP.md',
    'docs\EXCHANGE_OS_READINESS_IMPLEMENTATION_REPORT.md',
    'docs\SOLANA_DEX_IMPLEMENTATION_REPORT.md'
)
foreach ($p in $checkPaths) {
    $full = Join-Path $Repo $p
    $exists = Test-Path $full
    L ("  [{0}] {1}" -f (if ($exists) { 'EXISTS' } else { 'MISSING' }), $p)
}

# --- List exchange-os dirs ---
L "`n=== exchange-os DIRECTORIES ==="
Get-ChildItem (Join-Path $Repo 'src\app\exchange-os') -Recurse -File -ErrorAction SilentlyContinue |
    Select-Object -First 40 FullName | ForEach-Object { L "  $($_.FullName)" }

Get-ChildItem (Join-Path $Repo 'src\components\exchange-os') -Recurse -File -ErrorAction SilentlyContinue |
    Select-Object -First 40 FullName | ForEach-Object { L "  $($_.FullName)" }

# --- typecheck ---
L "`n=== TYPECHECK ==="
$tc = & npm run typecheck 2>&1 | Out-String
L $tc

# --- lint (new files only) ---
L "`n=== LINT (exchange-os files only) ==="
$lintOut = & npx eslint src/data/exchangeOsReadiness.ts src/data/solanaDexRegistry.ts src/app/exchange-os src/components/exchange-os 2>&1 | Out-String
L $lintOut

L "`n=== VERIFICATION DONE. Log: $log ==="
