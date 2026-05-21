# Generate SYSTEM_MANIFEST PDF (optional pandoc / mmdc) + HTML fallback
param(
    [string]$SourceMd = "",
    [switch]$HtmlOnly
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
if (-not $SourceMd) {
    $SourceMd = Join-Path $Root "docs\technical\SYSTEM_MANIFEST.md"
}
$Downloads = Join-Path $Root "docs\downloads"
$OutPdf = Join-Path $Downloads "SYSTEM_MANIFEST.pdf"
$OutHtml = Join-Path $Downloads "SYSTEM_MANIFEST.html"

if (-not (Test-Path $SourceMd)) {
    throw "Missing manifest: $SourceMd"
}
New-Item -ItemType Directory -Path $Downloads -Force | Out-Null

function Test-Cmd($name) {
    $null -ne (Get-Command $name -ErrorAction SilentlyContinue)
}

# HTML fallback (always)
$md = Get-Content $SourceMd -Raw -Encoding UTF8
$htmlBody = $md -replace '(?m)^---\r?\n.*?\r?\n---\r?\n', ''
$htmlBody = [System.Net.WebUtility]::HtmlEncode($htmlBody)
$htmlBody = $htmlBody -replace "`n", "<br>`n"
$css = "../downloads/print-shared.css"
$html = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>TROPTIONS System Manifest</title>
  <link rel="stylesheet" href="$css"/>
  <style>body{font-family:system-ui,sans-serif;max-width:52rem;margin:2rem auto;padding:0 1rem;line-height:1.5}</style>
</head>
<body>
  <p class="no-print"><em>HTML fallback — install pandoc for PDF. Labels: PROVEN / PIPELINE / PROJECTION.</em></p>
  <pre style="white-space:pre-wrap;font-size:0.85rem">$htmlBody</pre>
</body>
</html>
"@
Set-Content -Path $OutHtml -Value $html -Encoding UTF8
Write-Host "Wrote HTML fallback: $OutHtml" -ForegroundColor Green

if ($HtmlOnly) { exit 0 }

$pdfOk = $false
if (Test-Cmd "pandoc") {
    Write-Host "pandoc -> $OutPdf" -ForegroundColor Cyan
    try {
        & pandoc $SourceMd -o $OutPdf 2>$null
        if (Test-Path $OutPdf) { $pdfOk = $true }
    } catch {
        Write-Host "pandoc PDF failed: $_" -ForegroundColor DarkYellow
    }
}

if (-not $pdfOk -and (Test-Cmd "npx")) {
    Write-Host "Trying mermaid-cli + pandoc (optional)..." -ForegroundColor DarkGray
}

if (-not $pdfOk) {
    Write-Host "PDF tools not found (pandoc/wkhtmltopdf). Use HTML at docs/downloads/SYSTEM_MANIFEST.html" -ForegroundColor Yellow
    Write-Host "Optional: choco install pandoc; or open SYSTEM_MANIFEST.html in browser -> Print to PDF"
    exit 0
}

Write-Host "Wrote PDF: $OutPdf" -ForegroundColor Green
