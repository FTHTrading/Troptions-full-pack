# TROPTIONS truth labels — probe local proof stack
$ErrorActionPreference = "Continue"
$results = @()

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

$results += Test-Endpoint "Apostle" "http://127.0.0.1:7332/health" -Keys @("status")
$results += Test-Endpoint "x402 Gateway" "http://127.0.0.1:4020/health" -Keys @("status")
$results += Test-Endpoint "Popeye" "http://127.0.0.1:4021/health" -Keys @("status")
$l1Body = @{ jsonrpc = "2.0"; method = "state_get"; params = @{}; id = 1 }
$results += Test-Endpoint "L1 RPC" "http://127.0.0.1:9944" -Method POST -Body $l1Body -Keys @("result.block_height")
try {
    $m = Invoke-WebRequest -Uri "http://127.0.0.1:9945/metrics" -UseBasicParsing -TimeoutSec 5
    $ml = if ($m.StatusCode -eq 200 -and $m.Content -match "troptions_") { "CONFIRMED" } else { "DEGRADED" }
    $results += [PSCustomObject]@{ Service = "L1 Metrics"; Url = "http://127.0.0.1:9945/metrics"; Label = $ml; Code = $m.StatusCode }
} catch {
    $results += [PSCustomObject]@{ Service = "L1 Metrics"; Url = "http://127.0.0.1:9945/metrics"; Label = "UNREACHABLE"; Code = "-" }
}
foreach ($p in @(8090, 8091, 8092, 8093)) {
    $results += Test-Endpoint "Backend $p" "http://127.0.0.1:$p/health" -Keys @("status")
}
$results | Format-Table -AutoSize
$results | ConvertTo-Json | Out-File -FilePath (Join-Path $PSScriptRoot "..\truth_labels_report.json")
