# XRPL Real-Issuer PoF Runbook

## Purpose

Define how TROPTIONS produces institution-usable proof of funds for transactions such as real estate acquisition, private program participation, and bilateral asset trades when the funding leg includes XRPL issued assets.

This runbook enforces a strict rule:

**Asset identity = currency code + issuer address.**

USDC code alone is never sufficient for institutional PoF classification.

## Scope

- XRPL issued-asset verification.
- Wallet-control proof.
- Source-of-funds and compliance packaging.
- Pass/fail determination for institutional delivery.

## Policy Baseline

1. `official` issuer class must be used for institutional PoF unless a counterparty contract explicitly accepts another issuer class.
2. Every PoF package must include both on-chain evidence and off-chain compliance evidence.
3. No package may be labeled as Circle USDC (or any named issuer asset) unless issuer address matches approved issuer registry.

## Required Inputs

1. Holder wallet address.
2. One or more relevant XRPL transaction hashes.
3. Asset symbol (example: `USDC`).
4. Minimum required balance for the transaction.
5. Counterparty deal reference and settlement purpose.

## Approved Issuer Registry

Primary registry file:

`scripts/config/xrpl-asset-allowlist.json`

For USDC, Circle official XRPL issuer is currently listed as:

`rGm7WCVp9gb4jZHWTEtGUr4dd74z2XuWhE`

## Execution Steps

### 1. On-chain issuer and balance verification

Run strict verifier:

```bash
npm run pof:xrpl:real-issuer -- \
  --holder <XRPL_HOLDER_ADDRESS> \
  --hash <TX_HASH_1> \
  --hash <TX_HASH_2> \
  --asset USDC \
  --issuer-class official \
  --min-balance 100000000 \
  --json \
  --out data/observability/pof/xrpl-real-issuer-report.json
```

Pass criteria from this step:

1. All provided hashes are `validated`.
2. All provided hashes have `tesSUCCESS`.
3. Asset issuer in tx evidence matches approved issuer list for selected class.
4. Holder account has trustline for the approved issuer asset.
5. Balance meets minimum threshold.

If any item fails, institutional PoF status is blocked.

### 2. Wallet-control proof

Required evidence (all):

1. Signed wallet-control challenge message from holder account (fresh timestamp and nonce).
2. Signature verification output archived in PoF packet.
3. Signer authority mapping to legal entity signatory.

Without signed wallet control, PoF remains incomplete.

Standalone wallet-control verifier:

```bash
npm run pof:xrpl:wallet-control -- \
  --holder <XRPL_HOLDER_ADDRESS> \
  --challenge "TROPTIONS_POF_CHALLENGE|holder=<XRPL_HOLDER_ADDRESS>|nonce=<NONCE>|issuedAt=<ISO>" \
  --signature <SIGNATURE_HEX> \
  --public-key <PUBLIC_KEY_HEX> \
  --json
```

Combined report mode (issuer + wallet control in one report):

```bash
npm run pof:xrpl:real-issuer -- \
  --holder <XRPL_HOLDER_ADDRESS> \
  --hash <TX_HASH_1> \
  --asset USDC \
  --issuer-class official \
  --min-balance 100000000 \
  --wallet-proof-file data/observability/pof/wallet-control-proof.json \
  --json \
  --out data/observability/pof/xrpl-real-issuer-report.json
```

### 3. Source-of-funds and source-of-wealth

Attach:

1. Source-of-funds memo tied to exact wallet and amount.
2. Supporting records (bank/custody inflow trail, conversion trail, or funding agreements).
3. Source-of-wealth profile per CIS/POF policy.

### 4. Compliance and legal sign-off

Attach:

1. KYC/KYB completion record.
2. Sanctions/AML screening results.
3. Compliance reviewer sign-off.
4. Legal reviewer sign-off where required by deal class.

### 5. Counterparty package assembly

Package should include:

1. Cover letter with no-overpromise language.
2. On-chain verification report JSON.
3. Human-readable addendum summarizing issuer classification.
4. Wallet-control evidence.
5. Source-of-funds/source-of-wealth memo.
6. Compliance and legal sign-offs.

## Classification Language

### Allowed wording when issuer is official

"Validated XRPL issued-asset evidence under approved official issuer `<issuer>` with holder trustline and balance confirmation as of validated ledger `<ledger_index>`."

### Allowed wording when issuer is non-official/internal

"Validated XRPL issued-asset evidence under issuer `<issuer>`; not classified as official `<asset>` issuer proof."

### Forbidden wording

1. "Official issuer PoF" when issuer address does not match approved official issuer.
2. "Funds proven" when wallet-control proof is missing.
3. "Closing-ready" when compliance sign-off is incomplete.

## Real Estate and Program Use

For real estate and institutional program onboarding, treat XRPL evidence as one component of PoF, not a standalone substitute for compliance diligence.

Minimum release gate:

1. On-chain issuer verification: PASS.
2. Wallet-control signed challenge: PASS.
3. Source-of-funds memo and support: PASS.
4. Compliance and legal review: PASS.
5. Counterparty acceptance of digital-asset PoF format: PASS.

If any gate is pending, status is `INCOMPLETE`.

## Operational Notes

1. Use multiple public RPC endpoints and archive endpoint used in report.
2. Timestamp every report and include transaction hashes exactly as submitted.
3. Store reports in immutable records (append-only evidence log or signed artifact store).
4. Re-run verification close to execution/closing date to satisfy freshness policy.

## Related Documents

1. `docs/troptions/proof-of-funds-request-checklist.md`
2. `docs/trade-desk/cis-pof/03-pof-template.md`
3. `docs/trade-desk/cis-pof/05-evidence-checklist.md`
4. `scripts/xrpl-verify-issuer-proof.mjs`
5. `scripts/xrpl-check-account-lines.mjs`
