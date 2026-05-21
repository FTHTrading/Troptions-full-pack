# Verify GitHub Pages paths (remote HTTP GET + local docs/ file existence).
param(
    [string]$BaseUrl = "https://fthtrading.github.io/Troptions-full-pack",
    [switch]$LocalOnly,
    [switch]$RemoteOnly,
    [string]$ManifestPath = ""
)

$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent $PSScriptRoot
$Docs = Join-Path $Root "docs"
if (-not $ManifestPath) {
    $ManifestPath = Join-Path $Docs "pages-manifest.json"
}
if (-not (Test-Path $ManifestPath)) {
    throw "Manifest not found: $ManifestPath"
}

$manifest = Get-Content $ManifestPath -Raw | ConvertFrom-Json
if ($BaseUrl -ne $manifest.baseUrl -and -not $PSBoundParameters.ContainsKey("BaseUrl")) {
    $BaseUrl = $manifest.baseUrl
}

$urlPaths = @($manifest.paths)
$fail = 0

Write-Host ""
Write-Host "Pages link check - $BaseUrl" -ForegroundColor Cyan
Write-Host "Manifest: $ManifestPath ($($urlPaths.Count) paths)"
Write-Host ""
Write-Host '| Path | Local | Remote |'
Write-Host '|------|-------|--------|'

foreach ($p in $urlPaths) {
    $rel = $p.TrimStart("/")
    if ($rel -eq "" -or $p -eq "/") { $rel = "index.html" }
    $localPath = Join-Path $Docs ($rel -replace "/", [IO.Path]::DirectorySeparatorChar)
    if ($p -match "/$" -and $rel -ne "index.html") {
        $localPath = Join-Path $localPath "index.html"
    }
    $localOk = if (-not $RemoteOnly) { Test-Path $localPath } else { $null }
    if ($null -eq $localOk) {
        $localStr = "-"
    } elseif ($localOk) {
        $localStr = "OK"
    } else {
        $localStr = "MISSING"
    }

    $remoteStr = "-"
    if (-not $LocalOnly) {
        $url = "$BaseUrl$p"
        try {
            $r = Invoke-WebRequest -Uri $url -Method Get -UseBasicParsing -TimeoutSec 45 -MaximumRedirection 5
            if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 400) {
                $remoteStr = "OK ($($r.StatusCode))"
            } else {
                $remoteStr = "$($r.StatusCode)"
            }
        } catch {
            if ($_.Exception.Response) {
                $remoteStr = "FAIL ($([int]$_.Exception.Response.StatusCode))"
            } else {
                $remoteStr = "ERR"
            }
        }
    }

    if ($localStr -eq "MISSING" -or $remoteStr -match "FAIL|ERR") { $fail++ }
    Write-Host "| $p | $localStr | $remoteStr |"
}

Write-Host ""
if ($fail -eq 0) {
    Write-Host "All checked paths OK." -ForegroundColor Green
} else {
    Write-Host "$fail path(s) failed - fix docs/ or wait for Pages deploy." -ForegroundColor Yellow
}
exit $fail
