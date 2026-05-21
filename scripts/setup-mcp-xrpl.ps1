# Setup MCP server integration for agent-orchestrator (:4731)
param(
    [string]$McpPort = "4731",
    [string]$McpUrl = "http://127.0.0.1:4731"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Fiat = Join-Path $Root "fiat-rails"
$AgentDir = Join-Path $Fiat "agent-orchestrator"

Write-Host "setup-mcp-xrpl — MCP target $McpUrl" -ForegroundColor Cyan

if (-not (Test-Path $AgentDir)) {
    throw "Missing agent-orchestrator at $AgentDir"
}

$envTemplate = Join-Path $AgentDir ".env.template"
$envLocal = Join-Path $AgentDir ".env"
if ((Test-Path $envTemplate) -and -not (Test-Path $envLocal)) {
    Copy-Item $envTemplate $envLocal
    Write-Host "  copied .env.template -> agent-orchestrator/.env" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Install MCP (vendor — no official monorepo pin):" -ForegroundColor Green
Write-Host "  1. Obtain MCP server from your vendor or build from upstream docs."
Write-Host "  2. Placeholder clone (replace URL when vendor publishes):"
Write-Host "     git clone https://github.com/example/mcp-xrpl-server.git C:\tools\mcp-server"
Write-Host "  3. Configure vendor .env (XRPL node URL, read-only keys — never commit seeds)."
Write-Host "  4. Start MCP on port $McpPort (example):"
Write-Host "     cd C:\tools\mcp-server; npm install; `$env:PORT=$McpPort; npm start"
Write-Host ""
Write-Host "Set in agent-orchestrator/.env:" -ForegroundColor Green
Write-Host "  MCP_URL=$McpUrl"
Write-Host ""

Write-Host "Health check:" -ForegroundColor Cyan
try {
    $r = Invoke-WebRequest -Uri "$McpUrl/health" -UseBasicParsing -TimeoutSec 3
    Write-Host "  MCP OK: $($r.StatusCode) $($r.Content)" -ForegroundColor Green
} catch {
    Write-Host "  MCP not reachable — orchestrator will use mock ledger context" -ForegroundColor Yellow
    Write-Host "  $($_.Exception.Message)"
}

Write-Host ""
Write-Host "Next: .\scripts\deploy-agentic-floor.ps1" -ForegroundColor Cyan
Write-Host "Docs: docs/technical/AGENTIC_RAG_AMM.md" -ForegroundColor Cyan
