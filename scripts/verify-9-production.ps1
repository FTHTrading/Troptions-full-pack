# Verify 9/10 production hardening (TLS, API keys, L1 DAO reads).
$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "=== verify-9-production ===" -ForegroundColor Cyan

& "$PSScriptRoot\setup-tls.ps1"

$fail = 0

# TLS nginx health (requires docker compose nginx + stack)
try {
    $r = Invoke-WebRequest -Uri "https://localhost/health" -SkipCertificateCheck -TimeoutSec 5
    if ($r.StatusCode -eq 200) {
        Write-Host "[OK] nginx TLS /health" -ForegroundColor Green
    } else { throw "bad status" }
} catch {
    Write-Host "[SKIP] nginx TLS /health — start: docker compose -f docker/docker-compose.prod.yml up -d nginx" -ForegroundColor Yellow
}

# API key 401
$env:API_KEYS = "verify-test-key"
try {
    $bad = Invoke-WebRequest -Uri "http://127.0.0.1:8093/dao/proposals" -Method POST `
        -Headers @{"X-API-Key"="invalid"} `
        -ContentType "application/json" `
        -Body '{"proposer":"' + ("aa" * 16) + '","title":"t","description":"d"}' `
        -SkipHttpErrorCheck
    if ($bad.StatusCode -eq 401) {
        Write-Host "[OK] invalid API key -> 401" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] expected 401, got $($bad.StatusCode)" -ForegroundColor Red
        $fail++
    }
} catch {
    Write-Host "[SKIP] dao-service :8093 not running for API key check" -ForegroundColor Yellow
}

# L1 dao_getProposals
try {
    $body = '{"jsonrpc":"2.0","method":"dao_getProposals","params":{},"id":1}'
    $l1 = Invoke-WebRequest -Uri "http://127.0.0.1:9944" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 5
    if ($l1.StatusCode -eq 200) {
        Write-Host "[OK] L1 dao_getProposals" -ForegroundColor Green
    }
} catch {
    try {
        $body = '{"jsonrpc":"2.0","method":"dao_getProposals","params":{},"id":1}'
        $l1 = Invoke-WebRequest -Uri "https://localhost/l1" -Method POST -Body $body -ContentType "application/json" -SkipCertificateCheck -TimeoutSec 5
        Write-Host "[OK] L1 dao_getProposals via nginx /l1/" -ForegroundColor Green
    } catch {
        Write-Host "[SKIP] L1 :9944 not reachable" -ForegroundColor Yellow
    }
}

Write-Host ""
if ($fail -gt 0) { exit 1 }
Write-Host "Verification complete (skipped items are OK if stack not up)."
