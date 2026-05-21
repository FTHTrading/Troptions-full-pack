# DONK AI TUTOR — Launch Script
# TROPTIONS Education System v3.0

param(
    [switch]$InstallDeps,
    [switch]$PullModels,
    [int]$Port = 8090
)

$ErrorActionPreference = "Stop"
$ScriptDir = $PSScriptRoot

function Header([string]$text) {
    Write-Host "`n==============================================" -ForegroundColor Cyan
    Write-Host "  $text" -ForegroundColor White
    Write-Host "==============================================" -ForegroundColor Cyan
}

function Ok([string]$text) { Write-Host "  [OK] $text" -ForegroundColor Green }
function Warn([string]$text) { Write-Host "  [WARN] $text" -ForegroundColor Yellow }
function Fail([string]$text) { Write-Host "  [FAIL] $text" -ForegroundColor Red }

Set-Location $ScriptDir

Header "DONK AI TUTOR v3.0 — Startup"

# Check Python
$pyVer = python --version 2>&1
if ($LASTEXITCODE -ne 0) { Fail "Python not found"; exit 1 }
Ok "Python: $pyVer"

# Check GPU
python -c "import torch; print(f'GPU: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else \"CPU\"}')" 2>$null
if ($LASTEXITCODE -eq 0) { Ok "GPU detected" } else { Warn "GPU check failed" }

# Install dependencies
if ($InstallDeps) {
    Header "Installing Dependencies"
    pip install -r requirements.txt
    Ok "Dependencies installed"
}

# Pull Ollama models
if ($PullModels) {
    Header "Pulling Ollama Models"
    ollama pull qwen2.5:7b
    ollama pull nomic-embed-text
    Ok "Models pulled"
}

# Check Ollama
Header "Checking Ollama"
try {
    $resp = Invoke-RestMethod "http://localhost:11434/api/tags" -TimeoutSec 5
    $models = $resp.models | ForEach-Object { $_.name }
    Ok "Ollama running with models: $($models -join ', ')"
} catch {
    Fail "Ollama not responding. Start it first: ollama serve"
    exit 1
}

# Start the API
Header "Starting DONK AI TUTOR API"
Write-Host "  Port: $Port" -ForegroundColor Gray
Write-Host "  URL: http://localhost:$Port" -ForegroundColor Gray
Write-Host "  Docs: http://localhost:$Port/docs" -ForegroundColor Gray
Write-Host ""

uvicorn main:app --host 0.0.0.0 --port $Port --reload
