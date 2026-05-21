# TROPTIONS Vercel Deployment Fix Audit

## Root Cause

Vercel was rolling back to an older deployment because the new sports routes failed during build.

The failure was caused by `.vercelignore` using an unanchored `data/` pattern. That pattern excluded `src/data/` from the Vercel build context, including:

- `src/data/sports/team.json`
- `src/data/worldcup/moments.json`
- `src/data/worldcup/moment_claims.json`
- `src/data/worldcup/mint_receipts.json`

Those files are required by the new sports/team and sports/moments pages. Local builds passed because the files existed locally, but Vercel did not receive them.

## Fix Applied

Commit: `9f9d2c4`

Changes:

1. `.vercelignore`
   - Changed `data/` to `/data/`
   - This now ignores only the root-level runtime data directory, not `src/data/`

2. `vercel.json`
   - Changed Vercel build command to `npm run build`
   - This ensures Vercel uses the same build command as local development, including the `--webpack` flag

## Expected Result

Vercel should stop rolling back and should deploy the current build with the new sports routes.

## Routes to Verify

- `/sports`
- `/sports/team`
- `/sports/funding`
- `/sports/moments`
- `/sports/proof`
- `/sports/partners`
- `/sports/tv`

## Funding Impact

This fix is important because the live grant/funding pages must resolve publicly before outreach to:

- Solana Foundation
- Colosseum
- Superteam
- Solana Mobile
- sponsors
- event agencies
- infrastructure partners

## Remaining Checks

- Confirm Vercel deployment succeeded
- Confirm all sports routes return HTTP 200
- Confirm `/sports/team` CTA to `/sports/funding` works
- Confirm `/sports/funding` CTAs work
- Confirm no console errors on page load
