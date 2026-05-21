# Health check all TROPTIONS sovereign stack services
$services = @(
    @{ Name = "L1"; Url = "http://127.0.0.1:9944" },
    @{ Name = "DONK"; Url = "http://127.0.0.1:8090/health" },
    @{ Name = "FTH"; Url = "http://127.0.0.1:8091/health" },
    @{ Name = "FTH-L1"; Url = "http://127.0.0.1:8091/health/l1" },
    @{ Name = "TTN"; Url = "http://127.0.0.1:8092/health" },
    @{ Name = "DAO"; Url = "http://127.0.0.1:8093/health" }
)

Write-Host "TROPTIONS Health Check" -ForegroundColor Cyan
$ok = 0
foreach ($s in $services) {
    try {
        if ($s.Name -eq "L1") {
            $body = '{"jsonrpc":"2.0","method":"state_get","params":{},"id":1}'
            $r = Invoke-RestMethod -Uri $s.Url -Method Post -Body $body -ContentType "application/json" -TimeoutSec 5
            if ($r.result) { Write-Host "[OK] $($s.Name)" -ForegroundColor Green; $ok++ }
            else { Write-Host "[FAIL] $($s.Name)" -ForegroundColor Red }
        } else {
            $r = Invoke-RestMethod -Uri $s.Url -TimeoutSec 5
            Write-Host "[OK] $($s.Name) — $($r.status)" -ForegroundColor Green
            $ok++
        }
    } catch {
        Write-Host "[FAIL] $($s.Name) — $_" -ForegroundColor Red
    }
}
Write-Host "$ok / $($services.Count) healthy"
