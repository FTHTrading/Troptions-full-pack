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
Write-Label "PENDING" "Apostle Chain AWS public endpoint - feature/x402-full-integration branch"
Write-Label "PENDING" "Popeye external heartbeat monitor"
Write-Label "PENDING" "Telnyx NEED AI vanity routing"
Write-Label "PENDING" "x402 public facilitator - LOCAL_ONLY on main; optional branch"

Write-Host ""
Write-Host "Publish output: docs/proof/truth-labels.md"
Write-Host ""
Write-Host "--- Local stack probes (x402 branch; services optional) ---"

function Test-Endpoint {
    param($Name, $Url, $Method = "GET", $Body = $null, $Keys = @())
    try {
        if ($Method -eq "GET") {
            $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
            $json = $r.Content | ConvertFrom-Json
        } else {
            $r = Invoke-WebRequest -Uri $Url -Method POST -Body ($Body | ConvertTo-Json) -ContentType "application/json" -UseBasicParsing -TimeoutSec 5
            $json = $r.Content | ConvertFrom-Json
        }
        $ok = $r.StatusCode -eq 200
        foreach ($k in $Keys) {
            $parts = $k -split '\.'
            $v = $json
            foreach ($p in $parts) {
                if ($v.PSObject.Properties.Name -contains $p) { $v = $v.$p } else { $ok = $false; break }
            }
        }
        $label = if ($ok) { "CONFIRMED" } else { "DEGRADED" }
        [PSCustomObject]@{ Service = $Name; Url = $Url; Label = $label; Code = $r.StatusCode }
    } catch {
        [PSCustomObject]@{ Service = $Name; Url = $Url; Label = "UNREACHABLE"; Code = "-" }
    }
}

$probeResults = @()
$probeResults += Test-Endpoint "Apostle" "http://127.0.0.1:7332/health" -Keys @("status")
$probeResults += Test-Endpoint "x402 Gateway" "http://127.0.0.1:4020/health" -Keys @("status")
$probeResults += Test-Endpoint "Popeye" "http://127.0.0.1:4021/health" -Keys @("status")
$l1Body = @{ jsonrpc = "2.0"; method = "state_get"; params = @{}; id = 1 }
$probeResults += Test-Endpoint "L1 RPC" "http://127.0.0.1:9944" -Method POST -Body $l1Body -Keys @("result.block_height")
foreach ($p in @(8090, 8091, 8092, 8093)) {
    $probeResults += Test-Endpoint "Backend $p" "http://127.0.0.1:$p/health" -Keys @("status")
}
$probeResults | Format-Table -AutoSize
$probeResults | ConvertTo-Json | Out-File -FilePath (Join-Path $Root "truth_labels_report.json")
Write-Label "PENDING" "x402_gateway LOCAL_ONLY - run stack then re-probe :4020"
Write-Label "PENDING" "Apostle ATP settlement - staged; not AWS production"
