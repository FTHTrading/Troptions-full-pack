<#
.SYNOPSIS
  Sync investor print HTML from docs/technical/investor-pdf/ to docs/downloads/ and sites/investor/public/downloads/.
.DESCRIPTION
  Canonical sources live in docs/technical/investor-pdf/*.html (+ print-shared.css).
  After editing those files, run this script to copy everywhere and optionally generate binary PDFs.

  Print from browser (always works):
    1. Open any HTML under docs/downloads/ in Chrome/Edge
    2. Ctrl+P → Destination: Save as PDF → Margins: Default → Background graphics: ON

  Optional CLI PDF generation:
    - Playwright: npx playwright pdf <file.html> <file.pdf>
    - md-to-pdf:  npx md-to-pdf (markdown only — use for .md sources if needed)

.EXAMPLE
  .\scripts\regenerate-investor-pdfs.ps1
.EXAMPLE
  .\scripts\regenerate-investor-pdfs.ps1 -GeneratePdf
#>
param(
    [switch]$GeneratePdf,
    [switch]$SyncTechnicalHtml
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$SrcDir = Join-Path $Root "docs\technical\investor-pdf"
$DestDirs = @(
    (Join-Path $Root "docs\downloads"),
    (Join-Path $Root "sites\investor\public\downloads")
)

$files = @(
    "print-shared.css",
    "investor-executive-summary.html",
    "on-chain-proof-sheet.html",
    "infrastructure-atlas.html",
    "opportunity-and-roadmap.html",
    "valuation-and-comparables.html",
    "INVESTOR_MASTER.pdf.html"
)

Write-Host "Regenerating investor PDF HTML pack (May 2026)..." -ForegroundColor Cyan
Write-Host "  Source: $SrcDir" -ForegroundColor DarkGray

foreach ($destRoot in $DestDirs) {
    if (-not (Test-Path $destRoot)) {
        New-Item -ItemType Directory -Path $destRoot -Force | Out-Null
    }
    foreach ($name in $files) {
        $src = Join-Path $SrcDir $name
        if (-not (Test-Path $src)) {
            Write-Warning "Missing source: $name"
            continue
        }
        $dest = Join-Path $destRoot $name
        Copy-Item -Path $src -Destination $dest -Force
        Write-Host "  -> $dest" -ForegroundColor DarkGray
    }
}

if ($SyncTechnicalHtml) {
    Write-Host "Running sync-technical-html.ps1..." -ForegroundColor Cyan
    & (Join-Path $PSScriptRoot "sync-technical-html.ps1")
}

if ($GeneratePdf) {
    $outDir = Join-Path $Root "docs\downloads"
    $htmlFiles = $files | Where-Object { $_ -like "*.html" }
    $generated = @()

    # Prefer Playwright (handles print CSS well)
    $playwright = Get-Command npx -ErrorAction SilentlyContinue
    if ($playwright) {
        foreach ($name in $htmlFiles) {
            $htmlPath = Join-Path $outDir $name
            $pdfName = $name -replace '\.html$', '.pdf'
            if ($name -eq "INVESTOR_MASTER.pdf.html") { $pdfName = "INVESTOR_MASTER.pdf" }
            $pdfPath = Join-Path $outDir $pdfName
            Write-Host "  PDF: $pdfName (playwright)" -ForegroundColor Cyan
            Push-Location $outDir
            try {
                npx --yes playwright pdf $name $pdfName 2>&1 | Out-Host
                if (Test-Path $pdfPath) { $generated += $pdfPath }
            } finally {
                Pop-Location
            }
        }
    }

    if ($generated.Count -eq 0) {
        Write-Host ""
        Write-Host "Binary PDFs not generated. Use browser Print -> Save as PDF:" -ForegroundColor Yellow
        foreach ($name in $htmlFiles) {
            Write-Host "  file:///$((Join-Path $outDir $name) -replace '\\','/')" -ForegroundColor White
        }
        Write-Host ""
        Write-Host "Or install Playwright once: npx playwright install chromium" -ForegroundColor Yellow
    } else {
        Write-Host "Generated $($generated.Count) PDF(s) in docs/downloads/" -ForegroundColor Green
    }
} else {
    Write-Host ""
    Write-Host "HTML synced. To print all PDFs:" -ForegroundColor Green
    Write-Host "  1. Open docs\downloads\INVESTOR_MASTER.pdf.html (full bundle) OR each sheet separately" -ForegroundColor White
    Write-Host "  2. Print -> Save as PDF (enable Background graphics)" -ForegroundColor White
    Write-Host "  3. Or: .\scripts\regenerate-investor-pdfs.ps1 -GeneratePdf" -ForegroundColor White
}

Write-Host "Done." -ForegroundColor Green
