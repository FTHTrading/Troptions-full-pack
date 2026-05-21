# Proof Stack — Truth Labels

Run `scripts/truth_labels.ps1` or `scripts/truth_labels.sh` to probe local services.

## Label rules

| Label | Meaning |
|-------|---------|
| **CONFIRMED** | HTTP 200 and JSON body matches expected schema keys |
| **UNREACHABLE** | Connection refused or timeout |
| **DEGRADED** | HTTP non-200 or body missing required fields |
| **STAGED** | Service up but `X402_MODE=staged` (no live ATP settlement) |

## Endpoints

| Service | URL | Required body keys |
|---------|-----|-------------------|
| Apostle Chain | `http://127.0.0.1:7332/health` | `status` or `ok` |
| x402 Gateway | `http://127.0.0.1:4020/health` | `status` |
| Popeye | `http://127.0.0.1:4021/health` | `status` |
| L1 RPC | `http://127.0.0.1:9944` POST `state_get` | `result.block_height` |
| L1 metrics | `http://127.0.0.1:9945/metrics` | `# HELP` prometheus text |
| Donk | `http://127.0.0.1:8090/health` | `status` |
| FTH Academy | `http://127.0.0.1:8091/health` | `status` |
| TTN | `http://127.0.0.1:8092/health` | `status` |
| DAO | `http://127.0.0.1:8093/health` | `status` |

Manual checks (not automated):

- **Reboot persistence**: stop L1, restart, verify `treasury_getBalance` unchanged.
- **Unsigned RPC fail**: `submit_transaction` without valid Ed25519 → `InvalidSignature`.
- **Multisig 2/3 fail**: treasury debit &gt; 1000 with only one council signature → error.
