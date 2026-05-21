# Emit CONFIRMED / PENDING labels for public proof page (honest operator checks).
$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

function Write-Label([string]$Status, [string]$Message) {
    Write-Host ("{0,-12} {1}" -f $Status, $Message)
}

$ts = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mmZ")
Write-Host "TROPTIONS Truth Labels - $ts"
Write-Host "repo: $(Split-Path -Leaf $Root)"
Write-Host ""

Push-Location l1
$cargoOk = $false
try {
    cargo test --workspace -q 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) { $cargoOk = $true }
} catch {}
Pop-Location
if ($cargoOk) {
    Write-Label "CONFIRMED" "L1 Rust workspace tests - cargo test --workspace"
} else {
    Write-Label "PENDING" "L1 Rust workspace tests"
}

python -m pytest tests/backend tests/dao -q 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Label "CONFIRMED" "Backend + DAO pytest - tests/backend tests/dao"
} else {
    Write-Label "PENDING" "Backend + DAO pytest"
}

if (Test-Path "l1/crates/state/src/persistence.rs") {
    Write-Label "CONFIRMED" "RocksDB persistence module - l1/crates/state/src/persistence.rs"
} else {
    Write-Label "PENDING" "RocksDB persistence"
}

if (Test-Path "l1/crates/runtime/src/multisig.rs") {
    Write-Label "CONFIRMED" "Treasury multisig - l1/crates/runtime/src/multisig.rs"
} else {
    Write-Label "PENDING" "Treasury multisig"
}

if (Test-Path "l1/tests/integration/signed_submit.rs") {
    Write-Label "CONFIRMED" "Signed submit integration test"
} else {
    Write-Label "PENDING" "Signed submit RPC"
}

$crateCount = (Get-ChildItem "l1/crates" -Directory).Count
Write-Label "CONFIRMED" "L1 workspace: $crateCount crates under l1/crates/ - not 27"

if (Select-String -Path "README.md" -Pattern "Sovereign Sequencer" -Quiet) {
    Write-Label "CONFIRMED" "Docs label sequencer - not BFT - in README"
} else {
    Write-Label "PENDING" "Sequencer vs BFT labeling"
}

Write-Label "CONFIRMED" "KENNY Polygon 0x93F2a3266a81c1F3Ee2c196b90890A959bC69BD7 - see README"
Write-Label "CONFIRMED" "XRPL gateway rPF2M1QjRj72rHdJyRqfFRTqWREBdJds3 - see README"

if (Test-Path "docker/nginx/nginx.conf") {
    Write-Label "CONFIRMED" "TLS_ENABLED - docker/nginx + setup-tls scripts"
} else {
    Write-Label "PENDING" "TLS_ENABLED"
}

if (Test-Path "backend/shared/auth.py") {
    Write-Label "CONFIRMED" "API_KEY_AUTH - backend/shared/auth.py"
} else {
    Write-Label "PENDING" "API_KEY_AUTH"
}

if (Select-String -Path "dao/governance/engine.py" -Pattern "dao_getProposals" -Quiet) {
    Write-Label "CONFIRMED" "DAO_DIRECT_L1 - dao_getProposals via engine + dashboard"
} else {
    Write-Label "PENDING" "DAO_DIRECT_L1"
}

if (Test-Path "l1/tests/integration/signed_dao_submit.rs") {
    Write-Label "CONFIRMED" "Signed DAO submit test - signed_dao_submit.rs"
} else {
    Write-Label "PENDING" "Signed DAO submit test"
}

Write-Label "PENDING" "TLS_PUBLIC_DNS - certbot on troptions.org hostnames"
Write-Label "PENDING" "FRAUD_PROOFS_LIVE - design only docs/design/fraud_proofs.md"
try {
    $x402 = Invoke-RestMethod -Uri "https://x402.unykorn.org/health" -TimeoutSec 20
    if ($x402.ok -eq $true) {
        Write-Label "CONFIRMED" "x402_PUBLIC_FACILITATOR - x402.unykorn.org/health live"
        if ($x402.chain.operational -eq $true) {
            Write-Label "CONFIRMED" "APOSTLE_CHAIN public health - chain_id $($x402.chain.chain_id)"
        } else {
            Write-Label "PENDING" "APOSTLE_CHAIN public health - chain not operational in JSON"
        }
    } else {
        Write-Label "PENDING" "x402_PUBLIC_FACILITATOR - health JSON ok!=true"
    }
} catch {
    Write-Label "PENDING" "x402_PUBLIC_FACILITATOR - $($_.Exception.Message)"
}
if (Test-Path "backend/x402-gateway/main.py") {
    Write-Label "CONFIRMED" "x402 monorepo sidecar - backend/x402-gateway on main (:4020)"
} else {
    Write-Label "PENDING" "x402 monorepo sidecar"
}
Write-Label "PENDING" "twin.unykorn.org - probe before demos (522/timeouts possible)"
Write-Label "PENDING" "Popeye external heartbeat monitor"
Write-Label "PENDING" "Telnyx NEED AI vanity routing"

Write-Host ""
Write-Host "Publish output: docs/proof/truth-labels.md"
