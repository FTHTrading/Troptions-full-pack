# Cloudflare D1 Campaign Persistence — Setup Guide

The campaign store (`src/lib/campaigns/store.ts`) auto-detects the `CAMPAIGN_DB` D1 binding
at runtime. When the binding is present (Cloudflare Workers / Pages), D1 is used. Otherwise
the store falls back to SQLite → JSON file → in-memory.

---

## Step 1 — Create the D1 database

```bash
wrangler d1 create troptions-campaigns
```

Copy the `database_id` from the output and paste it into `wrangler.jsonc`:

```jsonc
"d1_databases": [
  {
    "binding": "CAMPAIGN_DB",
    "database_name": "troptions-campaigns",
    "database_id": "<PASTE_ID_HERE>"   // ← replace this
  }
]
```

---

## Step 2 — Apply the schema

```bash
wrangler d1 execute troptions-campaigns --file=db/schema.sql
```

Verify the table was created:

```bash
wrangler d1 execute troptions-campaigns --command="SELECT name FROM sqlite_master WHERE type='table';"
```

---

## Step 3 — Local development with D1

To use D1 locally (via Miniflare), start the dev server with wrangler:

```bash
wrangler pages dev .open-next --d1=CAMPAIGN_DB=<database_id>
```

Or run the Next.js dev server normally — it will use SQLite fallback without the binding.

---

## Step 4 — Cloudflare Pages deployment

In the Cloudflare dashboard:

1. Go to **Workers & Pages** → `troptions` → **Settings** → **Bindings**
2. Add a **D1 Database** binding:
   - Variable name: `CAMPAIGN_DB`
   - D1 database: `troptions-campaigns`
3. Redeploy (trigger a new build or `wrangler pages deploy`)

---

## Step 5 — Verify

After deployment, open `https://launch.unykorn.org/admin/campaigns/solana`.
The footer should no longer say "Memory fallback" — campaigns now persist across requests.

---

## Schema reference

See `db/schema.sql` for the full table definition. Key columns:

| Column | Type | Notes |
|---|---|---|
| `namespace` | TEXT UNIQUE | URL slug, e.g. `test-shop` |
| `mint_status` | TEXT | `stub` / `pending` / `minted` |
| `network` | TEXT | `devnet` / `mainnet-beta` |
| `not_investment` | INTEGER | Always 1 — legal compliance flag |
| `not_prediction_market` | INTEGER | Always 1 — regulatory compliance flag |
