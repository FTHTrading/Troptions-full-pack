$ErrorActionPreference = 'Continue'
Set-Location "C:\Users\Kevan\solana-launcher"

function Push-VercelEnv {
  param([string]$Key, [string]$Val)
  if (-not $Val -or $Val.Length -eq 0) { Write-Host "  SKIP $Key (empty)"; return }
  Write-Host "  Pushing $Key (len=$($Val.Length))..."
  # --yes skips confirmation prompts (including the NEXT_PUBLIC_ warning)
  $result = $Val | vercel env add $Key production --force --yes 2>&1
  $ok = $result | Where-Object { $_ -match "Overrode|Created|Added" }
  $err = $result | Where-Object { $_ -match "^Error" }
  if ($ok) { Write-Host "    [OK]" } elseif ($err) { Write-Host "    [ERR] $err" } else { Write-Host "    [?] $($result -join ' ')" }
}

function Get-EnvLine {
  param([string]$Key)
  $line = Get-Content ".env.local" | Where-Object { $_ -match "^$Key=" } | Select-Object -First 1
  if ($line) { return ($line -split "=", 2)[1].Trim().Trim('"') }
  return ""
}

Write-Host ""
Write-Host "=== PUSHING PUBLIC / RUNTIME VARS ==="
Push-VercelEnv "NEXT_PUBLIC_APP_NAME"             "TROPTIONS Token Launcher"
Push-VercelEnv "NEXT_PUBLIC_APP_URL"              "https://launch.unykorn.org"
Push-VercelEnv "NEXT_PUBLIC_SOLANA_NETWORK"       "mainnet-beta"
Push-VercelEnv "NEXT_PUBLIC_SOLANA_RPC_URL"       "https://api.mainnet-beta.solana.com"
Push-VercelEnv "NEXT_PUBLIC_TREASURY_WALLET"      "2TQj18rWG3hMmJFT2YDdQMkNyPh7F6UxUYQFQEgZCm1N"
Push-VercelEnv "NEXT_PUBLIC_TRUST_WALLET"         "AYkhV7iCM9rYW2b9iVREEn7BCWyLnRV2jUuVf6TSbjie"
Push-VercelEnv "NEXT_PUBLIC_CREATION_FEE_SOL"     "0.1"
Push-VercelEnv "NEXT_PUBLIC_STORAGE_PROVIDER"     "pinata"
Push-VercelEnv "X402_NETWORK"                     "base-mainnet"
Push-VercelEnv "X402_PAY_TO_ADDRESS"              "0xD65171D21770B27776A4960c0D3D23627E18b115"
Push-VercelEnv "NEXT_PUBLIC_X402_PAY_TO_ADDRESS"  "0xD65171D21770B27776A4960c0D3D23627E18b115"
Push-VercelEnv "NEXT_PUBLIC_PINATA_GATEWAY"       (Get-EnvLine "NEXT_PUBLIC_PINATA_GATEWAY")
Push-VercelEnv "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" (Get-EnvLine "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")

Write-Host ""
Write-Host "=== PUSHING SECRET VARS ==="
Push-VercelEnv "PINATA_JWT"              (Get-EnvLine "PINATA_JWT")
Push-VercelEnv "OPENAI_API_KEY"          (Get-EnvLine "OPENAI_API_KEY")
Push-VercelEnv "STRIPE_SECRET_KEY"       (Get-EnvLine "STRIPE_SECRET_KEY")
Push-VercelEnv "STRIPE_WEBHOOK_SECRET"   (Get-EnvLine "STRIPE_WEBHOOK_SECRET")
Push-VercelEnv "TRUST_WALLET_SECRET_KEY" (Get-EnvLine "TRUST_WALLET_SECRET_KEY")

Write-Host ""
Write-Host "=== ALL VARS PUSHED ==="
