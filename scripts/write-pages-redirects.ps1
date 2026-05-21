# Create GitHub Pages redirects for mistaken double basePath URLs.
param(
    [string]$DocsRoot = ""
)

$ErrorActionPreference = "Stop"
if (-not $DocsRoot) {
    $DocsRoot = Join-Path (Split-Path -Parent $PSScriptRoot) "docs"
}

$canonical = "https://fthtrading.github.io/Troptions-full-pack/"
$target = "/Troptions-full-pack/"

$html = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="refresh" content="0; url=$target" />
  <link rel="canonical" href="$canonical" />
  <title>Redirecting to TROPTIONS investor site</title>
  <script>location.replace("$target");</script>
</head>
<body>
  <p>Moved to <a href="$target">$canonical</a>.</p>
</body>
</html>
"@

$nestedDir = Join-Path $DocsRoot "Troptions-full-pack"
if (-not (Test-Path $nestedDir)) {
    New-Item -ItemType Directory -Path $nestedDir -Force | Out-Null
}
$utf8 = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText((Join-Path $nestedDir "index.html"), $html, $utf8)
[System.IO.File]::WriteAllText((Join-Path $DocsRoot "Troptions-full-pack.html"), $html, $utf8)

$anthemCanonical = "https://fthtrading.github.io/Troptions-full-pack/anthem/"
$anthemTarget = "/Troptions-full-pack/anthem/"
$anthemHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="refresh" content="0; url=$anthemTarget" />
  <link rel="canonical" href="$anthemCanonical" />
  <title>Redirecting to TROPTIONS anthem lyrics</title>
  <script>location.replace("$anthemTarget");</script>
</head>
<body>
  <p>Moved to <a href="$anthemTarget">$anthemCanonical</a>.</p>
</body>
</html>
"@

$anthemNestedDir = Join-Path $nestedDir "anthem"
if (-not (Test-Path $anthemNestedDir)) {
    New-Item -ItemType Directory -Path $anthemNestedDir -Force | Out-Null
}
[System.IO.File]::WriteAllText((Join-Path $anthemNestedDir "index.html"), $anthemHtml, $utf8)

Write-Host "Pages redirects: docs/Troptions-full-pack/index.html, docs/Troptions-full-pack.html, docs/Troptions-full-pack/anthem/index.html" -ForegroundColor Green
