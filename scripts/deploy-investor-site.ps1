# Build investor Next.js site; optional Vercel/Netlify deploy or GitHub Pages docs copy.
param(
    [switch]$VercelProd,
    [switch]$NetlifyProd,
    [switch]$CopyToDocs
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Site = Join-Path $Root "sites\investor"

Push-Location $Site
try {
    if (-not (Test-Path "node_modules")) {
        npm install
    }
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "npm run build failed" }
    Write-Host "Build OK: $Site\out" -ForegroundColor Green

    if ($CopyToDocs) {
        $DocsOut = Join-Path $Root "docs\investor-site"
        if (Test-Path $DocsOut) { Remove-Item $DocsOut -Recurse -Force }
        Copy-Item (Join-Path $Site "out") $DocsOut -Recurse
        Write-Host "Copied static export to docs\investor-site (GitHub Pages fallback)" -ForegroundColor Cyan
    }

    if ($VercelProd) {
        if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
            throw "vercel CLI not found. npm i -g vercel"
        }
        vercel --prod
    }

    if ($NetlifyProd) {
        if (-not (Get-Command netlify -ErrorAction SilentlyContinue)) {
            throw "netlify CLI not found. npm i -g netlify-cli"
        }
        netlify deploy --prod --dir=out
    }
}
finally {
    Pop-Location
}
