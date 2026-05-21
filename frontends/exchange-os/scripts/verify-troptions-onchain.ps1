$ErrorActionPreference = 'Stop'
$ISSUER = 'rJLMSTy77hTxqgDw9WMxCnYC8m5vhqN3FQ'
$CUR = '54524F5054494F4E530000000000000000000000'
$STELLAR_ISSUER = 'GB4FHGFUTLLMS3SC5RWRK6RYBGDIUQ5NR7IGN5TWAA3QVHULJ34JGEG4'

Write-Host "=== XRPL: Total Supply (gateway_balances) ===" -ForegroundColor Cyan
$body = @{ method='gateway_balances'; params=@(@{ account=$ISSUER; ledger_index='validated' }) } | ConvertTo-Json -Compress -Depth 5
$r = Invoke-RestMethod -Method POST -Uri 'https://xrplcluster.com/' -Body $body -ContentType 'application/json'
"Ledger: $($r.result.ledger_index)"
"Supply: $($r.result.obligations.$CUR) TROPTIONS"

Write-Host "`n=== XRPL: Trustlines on issuer ===" -ForegroundColor Cyan
$body = @{ method='account_lines'; params=@(@{ account=$ISSUER; ledger_index='validated'; limit=400 }) } | ConvertTo-Json -Compress -Depth 5
$r = Invoke-RestMethod -Method POST -Uri 'https://xrplcluster.com/' -Body $body -ContentType 'application/json'
"Trustline count: $($r.result.lines.Count)"
$r.result.lines | ForEach-Object {
    $bal = [decimal]([math]::Abs([decimal]$_.balance))
    "  $($_.account) -> $bal TROPTIONS"
}

Write-Host "`n=== XRPL: AMM ===" -ForegroundColor Cyan
$body = @{ method='amm_info'; params=@(@{ asset=@{ currency='XRP' }; asset2=@{ currency=$CUR; issuer=$ISSUER }; ledger_index='validated' }) } | ConvertTo-Json -Compress -Depth 6
$r = Invoke-RestMethod -Method POST -Uri 'https://xrplcluster.com/' -Body $body -ContentType 'application/json'
$amm = $r.result.amm
"AMM Account: $($amm.account)"
$xrp = [decimal]$amm.amount / 1000000
"XRP in pool: $xrp"
"TROPTIONS in pool: $($amm.amount2.value)"
"Trading fee: $($amm.trading_fee / 10000 * 100)%"
"LP token supply: $($amm.lp_token.value)"

Write-Host "`n=== XRPL: Issuer transaction history ===" -ForegroundColor Cyan
$body = @{ method='account_tx'; params=@(@{ account=$ISSUER; ledger_index_min=-1; ledger_index_max=-1; limit=400 }) } | ConvertTo-Json -Compress -Depth 5
$r = Invoke-RestMethod -Method POST -Uri 'https://xrplcluster.com/' -Body $body -ContentType 'application/json'
"Total transactions on issuer account: $($r.result.transactions.Count)"
$r.result.transactions | ForEach-Object { $_.tx_json.TransactionType } | Group-Object | Sort-Object Count -Descending | ForEach-Object {
    "  $($_.Count.ToString().PadLeft(4)) x $($_.Name)"
}

Write-Host "`n=== XRPL: AMM account transactions (DEX activity) ===" -ForegroundColor Cyan
$body = @{ method='account_tx'; params=@(@{ account=$amm.account; ledger_index_min=-1; ledger_index_max=-1; limit=400 }) } | ConvertTo-Json -Compress -Depth 5
$r = Invoke-RestMethod -Method POST -Uri 'https://xrplcluster.com/' -Body $body -ContentType 'application/json'
"Total tx on AMM: $($r.result.transactions.Count)"
$r.result.transactions | ForEach-Object { $_.tx_json.TransactionType } | Group-Object | Sort-Object Count -Descending | ForEach-Object {
    "  $($_.Count.ToString().PadLeft(4)) x $($_.Name)"
}

Write-Host "`n=== XRPL: Distribution wallet (rNX4faQ35...) tx ===" -ForegroundColor Cyan
$body = @{ method='account_tx'; params=@(@{ account='rNX4faQ35SdtE4rDoEg8YeVLQKQ57AYyCt'; ledger_index_min=-1; ledger_index_max=-1; limit=400 }) } | ConvertTo-Json -Compress -Depth 5
$r = Invoke-RestMethod -Method POST -Uri 'https://xrplcluster.com/' -Body $body -ContentType 'application/json'
"Total tx on Distribution: $($r.result.transactions.Count)"
$r.result.transactions | ForEach-Object { $_.tx_json.TransactionType } | Group-Object | Sort-Object Count -Descending | ForEach-Object {
    "  $($_.Count.ToString().PadLeft(4)) x $($_.Name)"
}

Write-Host "`n=== XRPL: rMbHoVjLF... (claimed Trader B) ===" -ForegroundColor Cyan
$body = @{ method='account_info'; params=@(@{ account='rMbHoVjLF2z3bS6Pg4NJcqoMsjyExn5LVu'; ledger_index='validated' }) } | ConvertTo-Json -Compress -Depth 5
$r = Invoke-RestMethod -Method POST -Uri 'https://xrplcluster.com/' -Body $body -ContentType 'application/json'
if ($r.result.account_data) {
    "Exists: yes (XRP balance: $([decimal]$r.result.account_data.Balance / 1000000) XRP)"
    $body2 = @{ method='account_lines'; params=@(@{ account='rMbHoVjLF2z3bS6Pg4NJcqoMsjyExn5LVu'; ledger_index='validated' }) } | ConvertTo-Json -Compress -Depth 5
    $r2 = Invoke-RestMethod -Method POST -Uri 'https://xrplcluster.com/' -Body $body2 -ContentType 'application/json'
    $tropLine = $r2.result.lines | Where-Object { $_.currency -eq $CUR -and $_.account -eq $ISSUER }
    if ($tropLine) {
        "Has TROPTIONS trustline: $($tropLine.balance)"
    } else {
        "Has TROPTIONS trustline: NO"
    }
} else {
    "Account does NOT exist on XRPL Mainnet ($($r.result.error))"
}

Write-Host "`n=== Stellar: Issuer asset state ===" -ForegroundColor Cyan
$r = Invoke-RestMethod -Uri "https://horizon.stellar.org/assets?asset_issuer=$STELLAR_ISSUER&limit=20"
$r._embedded.records | ForEach-Object {
    "Code: $($_.asset_code)  Amount: $($_.amount)  Holders: $($_.num_accounts)  LPs: $($_.num_liquidity_pools)"
}
