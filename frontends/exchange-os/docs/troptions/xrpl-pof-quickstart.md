# XRPL PoF Quickstart (PowerShell)

## Why This File Exists

PowerShell command wrapping can cause partial commands to run and return exit code `1`.
Use the exact command forms below.

## 1) Create Wallet-Control Proof File

Copy this template:

`data/observability/pof/wallet-control-proof.template.json`

Save a filled copy as:

`data/observability/pof/wallet-control-proof.json`

## 2) Verify Wallet Control (Standalone)

Run as one line:

```powershell
npm run pof:xrpl:wallet-control -- --proof-file data/observability/pof/wallet-control-proof.json --json
```

## 3) Run Combined Real-Issuer PoF Report

Run as one line:

```powershell
npm run pof:xrpl:real-issuer -- --holder rYOUR_HOLDER_ADDRESS --hash YOUR_TX_HASH_1 --hash YOUR_TX_HASH_2 --asset USDC --issuer-class official --min-balance 100000000 --wallet-proof-file data/observability/pof/wallet-control-proof.json --json --out data/observability/pof/xrpl-real-issuer-report.json
```

## 4) Run 175M USDC PoF Profile

Create proof file from:

`data/observability/pof/wallet-control-proof.usdc-175m.template.json`

Save as:

`data/observability/pof/wallet-control-proof.usdc-175m.json`

Then run:

```powershell
npm run pof:xrpl:usdc:175m -- --holder rYOUR_HOLDER_ADDRESS --hash YOUR_TX_HASH_1 --hash YOUR_TX_HASH_2
```

## 5) Separate USDC 175M Mint Flow

Dedicated dry-run command (separate from the multi-asset provision command):

```powershell
npm run mint:xrpl:usdc:175m
```

Dedicated mainnet execute command:

```powershell
npm run mint:xrpl:usdc:175m:mainnet
```

This dedicated flow mints only USDC with `175000000` supply and skips USDT/DAI/EURC.

## PowerShell Multi-line Safe Form

If you want multiline, use backtick continuation at end of each line:

```powershell
npm run pof:xrpl:real-issuer -- `
  --holder rYOUR_HOLDER_ADDRESS `
  --hash YOUR_TX_HASH_1 `
  --hash YOUR_TX_HASH_2 `
  --asset USDC `
  --issuer-class official `
  --min-balance 100000000 `
  --wallet-proof-file data/observability/pof/wallet-control-proof.json `
  --json `
  --out data/observability/pof/xrpl-real-issuer-report.json
```

## Common Failure Cases

1. Last line only executed (for example only `--out ...`): command was split incorrectly.
2. Missing required fields: wallet proof file incomplete.
3. RPC failure: public endpoint temporary issue, retry with `--rpc` override.
