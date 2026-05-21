CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  namespace TEXT UNIQUE NOT NULL,
  campaign_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  campaign_type TEXT NOT NULL,
  description TEXT NOT NULL,
  city_or_event TEXT NOT NULL,
  offer TEXT NOT NULL,
  image_url TEXT,
  expiration TEXT,
  quantity INTEGER NOT NULL DEFAULT 100,
  qr_destination TEXT,
  qr_url TEXT NOT NULL,
  network TEXT NOT NULL DEFAULT 'devnet',
  mint_status TEXT NOT NULL DEFAULT 'stub',
  mint_tx_signature TEXT,
  mint_address TEXT,
  not_investment INTEGER NOT NULL DEFAULT 1,
  not_prediction_market INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_campaigns_namespace ON campaigns(namespace);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at);
