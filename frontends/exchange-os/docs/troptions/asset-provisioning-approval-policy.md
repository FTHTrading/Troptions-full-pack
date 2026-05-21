# Asset Provisioning Approval Policy

This policy governs every XRPL or Stellar transaction submitted by the
`scripts/provision-troptions-assets.mjs` orchestrator.

## Decision tree

```
            ┌──────────────────────────────┐
            │ provision-troptions-assets   │
            └──────────────┬───────────────┘
                           │
              no ─── --execute? ─── yes
              │                       │
   allowed-dry-run                    │
                                      ▼
                         all approval env vars set?
                              │              │
                       no ────┘              └──── yes
                       │                            │
                    blocked                         ▼
                                       network === "mainnet"?
                                              │           │
                                            yes           no
                                              │           │
                                           blocked    allowed-with-approval
                                          (policy:        (testnet only)
                                           CHB not
                                           wired)
```

## Required approvals

| Approval | Env variable | Owner |
| --- | --- | --- |
| Execute acknowledgement | `TROPTIONS_PROVISIONING_EXECUTE=YES_I_UNDERSTAND` | operator |
| Control Hub approval | `TROPTIONS_CONTROL_HUB_APPROVAL_ID` | Control Hub |
| Legal review | `TROPTIONS_LEGAL_REVIEW_ID` | counsel |
| Custody review | `TROPTIONS_CUSTODY_REVIEW_ID` | custody team |

Until all four are present **and** the network is `testnet`, every live
write is blocked by the policy engine
([`assetProvisioningPolicyEngine.ts`](../../src/lib/troptions/asset-provisioning/assetProvisioningPolicyEngine.ts)).

## Mainnet block

Mainnet writes are blocked unconditionally by the current policy. To unblock
mainnet, the following must occur in order:

1. Compliance, legal, and custody sign off in writing.
2. `troptions-control-plane/release-gates.json` is updated to allow the
   specific operation set.
3. `troptions-control-plane/approvals.json` records an explicit approval ID
   tied to the planned operation set.
4. The policy engine's mainnet block is replaced with an evaluation that
   reads the Control Hub records via the existing
   `xrplStellarControlHubBridge.ts` pattern.
5. Two-person review of the change to the policy engine.

## What dry-run does

- Walks every planned operation.
- Verifies wallet seeds derive to the expected public addresses (the seeds
  themselves are never printed or logged).
- Confirms metadata URLs resolve to canonical paths.
- Writes an audit record to `data/treasury-funding-log.json`.

## What dry-run does not do

- Does not connect to mainnet endpoints unless the gates are satisfied.
- Does not sign or submit any transaction.
- Does not represent an issued asset, a regulatory filing, or a guarantee.
