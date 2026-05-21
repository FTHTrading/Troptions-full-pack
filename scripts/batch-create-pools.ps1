# TROPTIONS Batch Liquidity Pool Creator
# Creates pools for all your tokens in one shot
# Usage: .\scripts\batch-create-pools.ps1

param(
 [string]$BaaSUrl = "http://localhost:4029",
 [string]$ApiKey = "your_api_key_here",
 [string]$WalletAddress = "rYourWalletAddress..."
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TROPTIONS BATCH POOL CREATOR" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Define your tokens here
$Tokens = @(
 # Token 1: Alexandrite
 @{
 symbol = "ALEX"
 name = "Alexandrite"
 issuer = "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ"
 collateral_type = "commodity"
 initial_supply = "1000000"
 base_amount = 50000
 counter_amount = 50000
 fee_percent = 0.25
 desired_pairs = @("ALEX/USD-IOU", "ALEX/EUR-IOU")
 },
 # Token 2: TROPTIONS-GOLD
 @{
 symbol = "XAU"
 name = "TROPTIONS-GOLD"
 issuer = "rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ"
 collateral_type = "commodity"
 initial_supply = "100000"
 base_amount = 1000
 counter_amount = 200000
 fee_percent = 0.25
 desired_pairs = @("XAU/USD-IOU", "XAU/EUR-IOU")
 },
 # Token 3: Partner Token (placeholder)
 @{
 symbol = "PART"
 name = "Partner Token"
 issuer = "rPartnerAddress..."
 collateral_type = "fiat"
 initial_supply = "10000000"
 base_amount = 1000000
 counter_amount = 10000
 fee_percent = 0.25
 desired_pairs = @("PART/USD-IOU")
 }
)

$CreatedTokens = @()
$CreatedPools = @()

foreach ($token in $Tokens) {
 Write-Host "Processing $($token.symbol)..." -ForegroundColor Yellow
 
 try {
 # Step 1: Onboard token (with x402 payment)
 Write-Host "  Step 1: Onboarding token..." -ForegroundColor Gray
 $tokenBody = @{
 symbol = $token.symbol
 name = $token.name
 issuer = $token.issuer
 collateral_type = $token.collateral_type
 initial_supply = $token.initial_supply
 desired_pairs = $token.desired_pairs
 } | ConvertTo-Json
 
 $tokenResponse = Invoke-RestMethod -Uri "$BaaSUrl/api/v1/tokens" `
 -Method Post `
 -Headers @{
 "Authorization" = "Bearer $ApiKey"
 "X-402-Wallet-Address" = $WalletAddress
 "Content-Type" = "application/json"
 } `
 -Body $tokenBody
 
 if ($tokenResponse.status -eq 'compliance_hold') {
 Write-Host "  ⚠️  Token $($token.symbol) held for compliance" -ForegroundColor Yellow
 continue
 }
 
 $tokenId = $tokenResponse.token_id
 Write-Host "  ✅ Token onboarded: $tokenId" -ForegroundColor Green
 $CreatedTokens += $tokenResponse
 
 # Step 2: Create liquidity pools for each desired pair
 foreach ($pair in $token.desired_pairs) {
 $counter = $pair.Split('/')[1]
 
 Write-Host "  Step 2: Creating pool $($token.symbol)/$counter..." -ForegroundColor Gray
 $poolBody = @{
 token_id = $tokenId
 base = $token.symbol
 counter = $counter
 initial_liquidity = @{
 base_amount = $token.base_amount
 counter_amount = $token.counter_amount
 }
 fee_percent = $token.fee_percent
 } | ConvertTo-Json
 
 $poolResponse = Invoke-RestMethod -Uri "$BaaSUrl/api/v1/tokens/$tokenId/pools" `
 -Method Post `
 -Headers @{
 "Authorization" = "Bearer $ApiKey"
 "X-402-Wallet-Address" = $WalletAddress
 "Content-Type" = "application/json"
 } `
 -Body $poolBody
 
 Write-Host "  ✅ Pool created: $($poolResponse.pool_id)" -ForegroundColor Green
 $CreatedPools += $poolResponse
 }
 
 } catch {
 Write-Host "  ❌ Error processing $($token.symbol): $_" -ForegroundColor Red
 }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "BATCH CREATION COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Tokens Created: $($CreatedTokens.Count)" -ForegroundColor Cyan
foreach ($t in $CreatedTokens) {
 Write-Host "  - $($t.symbol): $($t.token_id)" -ForegroundColor White
}
Write-Host ""
Write-Host "Pools Created: $($CreatedPools.Count)" -ForegroundColor Cyan
foreach ($p in $CreatedPools) {
 Write-Host "  - $($p.base)/$($p.counter): $($p.pool_id)" -ForegroundColor White
}
Write-Host ""
Write-Host "Revenue streams now active:" -ForegroundColor Yellow
Write-Host "  • Trading fees (0.25% per trade)" -ForegroundColor White
Write-Host "  • Spread capture (arbitrage bot)" -ForegroundColor White
Write-Host "  • x402 data fees (bot pays per snapshot)" -ForegroundColor White
Write-Host ""
Write-Host "Next: Start arbitrage bot" -ForegroundColor Yellow
Write-Host "  curl -X POST http://localhost:4028/start" -ForegroundColor White
