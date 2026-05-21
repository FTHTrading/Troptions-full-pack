# Build investor Next.js site; optional Vercel/Netlify deploy or GitHub Pages docs copy.
param(
    [switch]$VercelProd,
    [switch]$NetlifyProd,
    [switch]$CopyToDocs
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Site = Join-Path $Root "sites\investor"
$Docs = Join-Path $Root "docs"
$Out = Join-Path $Site "out"

function Move-ToTechnical {
    param([string]$RelativePath)
    $src = Join-Path $Docs $RelativePath
    if (-not (Test-Path $src)) { return }
    $dest = Join-Path $Docs "technical\$RelativePath"
    $destParent = Split-Path $dest -Parent
    if (-not (Test-Path $destParent)) {
        New-Item -ItemType Directory -Path $destParent -Force | Out-Null
    }
    if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
    Move-Item $src $dest -Force
    Write-Host "  technical/$RelativePath" -ForegroundColor DarkGray
}

Push-Location $Site
try {
    if (-not (Test-Path "node_modules")) {
        npm ci
    } else {
        npm ci
    }

    if ($CopyToDocs) {
        $env:GITHUB_PAGES = "true"
        $env:NEXT_PUBLIC_TELEGRAM_BOT_USERNAME = "NeedAI_Ada_bot"
    }
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "npm run build failed" }
    Remove-Item Env:GITHUB_PAGES -ErrorAction SilentlyContinue
    Remove-Item Env:NEXT_PUBLIC_TELEGRAM_BOT_USERNAME -ErrorAction SilentlyContinue
    Write-Host "Build OK: $Out" -ForegroundColor Green

    if ($CopyToDocs) {
        Write-Host "`nPreparing docs/ for GitHub Pages (investor site at root)..." -ForegroundColor Cyan

        $Technical = Join-Path $Docs "technical"
        if (-not (Test-Path $Technical)) {
            New-Item -ItemType Directory -Path $Technical -Force | Out-Null
        }

        Write-Host "Moving technical markdown into docs/technical/ ..." -ForegroundColor Cyan
        @(
            "executive",
            "proof",
            "infrastructure",
            "deploy",
            "design",
            "guide",
            "counterparty",
            "investor",
            "media"
        ) | ForEach-Object { Move-ToTechnical $_ }

        $rootMd = Get-ChildItem $Docs -File -Filter "*.md" -ErrorAction SilentlyContinue
        foreach ($f in $rootMd) {
            if ($f.Name -eq "GITHUB_PAGES_SETUP.md") { continue }
            Move-Item $f.FullName (Join-Path $Technical $f.Name) -Force
            Write-Host "  technical/$($f.Name)" -ForegroundColor DarkGray
        }

        foreach ($name in @("_config.yml", "index.html", "index.md", "Gemfile")) {
            $p = Join-Path $Docs $name
            if (Test-Path $p) {
                $bak = "$p.bak"
                if (Test-Path $bak) { Remove-Item $bak -Force }
                Move-Item $p $bak -Force
                Write-Host "Backed up $name -> $name.bak" -ForegroundColor DarkGray
            }
        }

        foreach ($name in @("_includes", "_layouts", "assets")) {
            $p = Join-Path $Docs $name
            if (Test-Path $p) {
                Move-ToTechnical $name
            }
        }

        $jekyllIndex = Join-Path $Docs "index.jekyll.md.bak"
        if (Test-Path $jekyllIndex) {
            Move-ToTechnical "index.jekyll.md.bak"
        }

        Write-Host "Copying static export to docs/ root ..." -ForegroundColor Cyan
        Get-ChildItem $Out -Force | ForEach-Object {
            $dest = Join-Path $Docs $_.Name
            if ($_.PSIsContainer) {
                if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
                Copy-Item $_.FullName $dest -Recurse -Force
            } else {
                Copy-Item $_.FullName $dest -Force
            }
        }

        Set-Content -Path (Join-Path $Docs ".nojekyll") -Value "" -NoNewline

        & (Join-Path $Root "scripts\write-pages-redirects.ps1") -DocsRoot $Docs

        Write-Host "Syncing technical HTML artifacts for Pages..." -ForegroundColor Cyan
        & (Join-Path $Root "scripts\sync-technical-html.ps1")

        # Standalone mint DApp + NFT gallery (not part of Next export)
        $mintSrc = Join-Path $Site "mint.html"
        if (Test-Path $mintSrc) {
            Copy-Item $mintSrc (Join-Path $Docs "mint.html") -Force
            Write-Host "  docs/mint.html" -ForegroundColor DarkGray
        }
        $nftGallerySrc = Join-Path $Docs "nft\index.html"
        if (-not (Test-Path $nftGallerySrc)) {
            $nftDir = Join-Path $Docs "nft"
            New-Item -ItemType Directory -Path $nftDir -Force | Out-Null
            Write-Host "  WARN: docs/nft/index.html missing - commit gallery HTML before deploy" -ForegroundColor Yellow
        }
        $anchorSrc = Join-Path $Root "TROPTIONS_L1_ANCHOR_CONFIRMED.json"
        if (Test-Path $anchorSrc) {
            Copy-Item $anchorSrc (Join-Path $Docs "TROPTIONS_L1_ANCHOR_CONFIRMED.json") -Force
            Write-Host "  docs/TROPTIONS_L1_ANCHOR_CONFIRMED.json" -ForegroundColor DarkGray
        }

        $daoPage = Join-Path $Docs "dao\index.html"
        if (-not (Test-Path $daoPage)) {
            Write-Host "  WARN: docs/dao/index.html missing - commit Sovereign DAO page before deploy" -ForegroundColor Yellow
        } else {
            Write-Host "  docs/dao/index.html (Sovereign DAO public page)" -ForegroundColor DarkGray
        }

        Write-Host "`nGitHub Pages home: $Docs\index.html" -ForegroundColor Green
        Write-Host "Live URL: https://fthtrading.github.io/Troptions-full-pack/" -ForegroundColor Green
        Write-Host "Anthem lyrics: https://fthtrading.github.io/Troptions-full-pack/anthem/" -ForegroundColor Green
        Write-Host "Mint DApp:  https://fthtrading.github.io/Troptions-full-pack/mint.html" -ForegroundColor Green
        Write-Host "NFT gallery: https://fthtrading.github.io/Troptions-full-pack/nft/" -ForegroundColor Green
        Write-Host "Technical docs: https://fthtrading.github.io/Troptions-full-pack/technical/" -ForegroundColor Green
        Write-Host "Sovereign DAO:  https://fthtrading.github.io/Troptions-full-pack/dao/" -ForegroundColor Green
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
    Remove-Item Env:GITHUB_PAGES -ErrorAction SilentlyContinue
    Remove-Item Env:NEXT_PUBLIC_TELEGRAM_BOT_USERNAME -ErrorAction SilentlyContinue
    Pop-Location
}
