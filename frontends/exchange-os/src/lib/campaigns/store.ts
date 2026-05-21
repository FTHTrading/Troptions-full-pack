// Campaign persistence store — D1 (CF Workers) → SQLite → JSON → in-memory fallback
// No private keys. No seed phrases. Devnet only by default.
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import type { CampaignAssetType } from '@/lib/solana/campaignTypes';

export interface CampaignRecord {
  id: string;
  namespace: string;
  campaignName: string;
  businessName: string;
  campaignType: CampaignAssetType;
  description: string;
  cityOrEvent: string;
  offer: string;
  imageUrl?: string;
  expiration?: string;
  quantity: number;
  qrDestination?: string;
  qrUrl: string;
  network: 'devnet' | 'mainnet-beta';
  mintStatus: 'pending' | 'minted' | 'stub';
  mintTxSignature?: string;
  mintAddress?: string;
  not_investment: true;
  not_prediction_market: true;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignInput {
  namespace: string;
  campaignName: string;
  businessName: string;
  campaignType: CampaignAssetType;
  description: string;
  cityOrEvent: string;
  offer: string;
  imageUrl?: string;
  expiration?: string;
  quantity: number;
  qrDestination?: string;
  qrUrl: string;
  network?: 'devnet' | 'mainnet-beta';
}

// ─────────────────────────────────────────────────────────────
// D1 adapter — Cloudflare Workers runtime (binding: CAMPAIGN_DB)
// ─────────────────────────────────────────────────────────────

type D1PreparedStatement = {
  bind: (...args: unknown[]) => D1PreparedStatement;
  run: () => Promise<{ success: boolean }>;
  first: <T>() => Promise<T | null>;
  all: <T>() => Promise<{ results: T[] }>;
};

type D1Database = {
  prepare: (sql: string) => D1PreparedStatement;
};

function getD1(): D1Database | null {
  const g = globalThis as Record<string, unknown>;
  return (g['CAMPAIGN_DB'] as D1Database) ?? null;
}

// D1 rows use snake_case columns (see db/schema.sql)
type D1Row = {
  id: string;
  namespace: string;
  campaign_name: string;
  business_name: string;
  campaign_type: string;
  description: string;
  city_or_event: string;
  offer: string;
  image_url?: string | null;
  expiration?: string | null;
  quantity: number;
  qr_destination?: string | null;
  qr_url: string;
  network: string;
  mint_status: string;
  mint_tx_signature?: string | null;
  mint_address?: string | null;
  created_at: string;
  updated_at: string;
};

function d1RowToRecord(row: D1Row): CampaignRecord {
  return {
    id: row.id,
    namespace: row.namespace,
    campaignName: row.campaign_name,
    businessName: row.business_name,
    campaignType: row.campaign_type as CampaignAssetType,
    description: row.description ?? '',
    cityOrEvent: row.city_or_event ?? '',
    offer: row.offer ?? '',
    imageUrl: row.image_url ?? undefined,
    expiration: row.expiration ?? undefined,
    quantity: Number(row.quantity),
    qrDestination: row.qr_destination ?? undefined,
    qrUrl: row.qr_url,
    network: (row.network as 'devnet' | 'mainnet-beta') ?? 'devnet',
    mintStatus: (row.mint_status as 'pending' | 'minted' | 'stub') ?? 'stub',
    mintTxSignature: row.mint_tx_signature ?? undefined,
    mintAddress: row.mint_address ?? undefined,
    not_investment: true,
    not_prediction_market: true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function d1SaveCampaign(db: D1Database, record: CampaignRecord): Promise<void> {
  await db
    .prepare(`
      INSERT INTO campaigns (
        id, namespace, campaign_name, business_name, campaign_type,
        description, city_or_event, offer, image_url, expiration,
        quantity, qr_destination, qr_url, network, mint_status,
        mint_tx_signature, mint_address, not_investment, not_prediction_market,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?)
    `)
    .bind(
      record.id,
      record.namespace,
      record.campaignName,
      record.businessName,
      record.campaignType,
      record.description,
      record.cityOrEvent,
      record.offer,
      record.imageUrl ?? null,
      record.expiration ?? null,
      record.quantity,
      record.qrDestination ?? null,
      record.qrUrl,
      record.network,
      record.mintStatus,
      record.mintTxSignature ?? null,
      record.mintAddress ?? null,
      record.createdAt,
      record.updatedAt,
    )
    .run();
}

async function d1GetByNamespace(db: D1Database, ns: string): Promise<CampaignRecord | null> {
  const row = await db
    .prepare('SELECT * FROM campaigns WHERE namespace = ?')
    .bind(ns)
    .first<D1Row>();
  return row ? d1RowToRecord(row) : null;
}

async function d1ListCampaigns(db: D1Database): Promise<CampaignRecord[]> {
  const { results } = await db
    .prepare('SELECT * FROM campaigns ORDER BY created_at DESC')
    .all<D1Row>();
  return results.map(d1RowToRecord);
}

async function d1UpdateMintStatus(
  db: D1Database,
  namespace: string,
  mintStatus: 'pending' | 'minted' | 'stub',
  mintTxSignature?: string,
  mintAddress?: string,
  updatedAt?: string,
): Promise<void> {
  await db
    .prepare(
      'UPDATE campaigns SET mint_status = ?, mint_tx_signature = ?, mint_address = ?, updated_at = ? WHERE namespace = ?',
    )
    .bind(mintStatus, mintTxSignature ?? null, mintAddress ?? null, updatedAt ?? new Date().toISOString(), namespace)
    .run();
}

// ─────────────────────────────────────────────────────────────
// SQLite / JSON / memory backends (Node.js / Vercel runtime)
// ─────────────────────────────────────────────────────────────

type StoreBackend = 'sqlite' | 'json' | 'memory';

const DB_PATH = process.env.CAMPAIGN_DB_PATH ?? path.join(process.cwd(), 'data', 'campaigns.db');
const JSON_PATH = path.join(path.dirname(DB_PATH), 'campaigns.json');

let _backend: StoreBackend = 'memory';
let _db: import('better-sqlite3').Database | null = null;

function ensureDataDir() {
  try {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  } catch {
    // ignore
  }
}

function initSQLite(): boolean {
  try {
    ensureDataDir();
    // Dynamic require so CF build doesn't fail at module parse time
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require('better-sqlite3') as typeof import('better-sqlite3');
    _db = new Database(DB_PATH);
    _db.exec(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id TEXT PRIMARY KEY,
        namespace TEXT UNIQUE NOT NULL,
        campaignName TEXT NOT NULL,
        businessName TEXT NOT NULL,
        campaignType TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        cityOrEvent TEXT NOT NULL DEFAULT '',
        offer TEXT NOT NULL DEFAULT '',
        imageUrl TEXT,
        expiration TEXT,
        quantity INTEGER NOT NULL DEFAULT 1,
        qrDestination TEXT,
        qrUrl TEXT NOT NULL,
        network TEXT NOT NULL DEFAULT 'devnet',
        mintStatus TEXT NOT NULL DEFAULT 'stub',
        mintTxSignature TEXT,
        mintAddress TEXT,
        not_investment INTEGER NOT NULL DEFAULT 1,
        not_prediction_market INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
    _backend = 'sqlite';
    return true;
  } catch {
    return false;
  }
}

function initJSON(): boolean {
  try {
    ensureDataDir();
    if (!fs.existsSync(JSON_PATH)) {
      fs.writeFileSync(JSON_PATH, JSON.stringify({ campaigns: [] }, null, 2));
    }
    _backend = 'json';
    return true;
  } catch {
    return false;
  }
}

function getBackend(): StoreBackend {
  if (_backend !== 'memory') return _backend;
  if (initSQLite()) return 'sqlite';
  if (initJSON()) return 'json';
  _backend = 'memory';
  return 'memory';
}

// In-memory fallback for environments without filesystem or D1
const _memStore: Map<string, CampaignRecord> = new Map();

// ─────────────────────────────────────────────────────────────
// JSON helpers
// ─────────────────────────────────────────────────────────────

function readJSON(): CampaignRecord[] {
  try {
    const raw = fs.readFileSync(JSON_PATH, 'utf-8');
    return (JSON.parse(raw) as { campaigns: CampaignRecord[] }).campaigns ?? [];
  } catch {
    return [];
  }
}

function writeJSON(records: CampaignRecord[]) {
  fs.writeFileSync(JSON_PATH, JSON.stringify({ campaigns: records }, null, 2));
}

// ─────────────────────────────────────────────────────────────
// SQLite row ↔ CampaignRecord (camelCase columns)
// ─────────────────────────────────────────────────────────────

function rowToRecord(row: Record<string, unknown>): CampaignRecord {
  return {
    id: row.id as string,
    namespace: row.namespace as string,
    campaignName: row.campaignName as string,
    businessName: row.businessName as string,
    campaignType: row.campaignType as CampaignAssetType,
    description: (row.description as string) ?? '',
    cityOrEvent: (row.cityOrEvent as string) ?? '',
    offer: (row.offer as string) ?? '',
    imageUrl: (row.imageUrl as string) ?? undefined,
    expiration: (row.expiration as string) ?? undefined,
    quantity: Number(row.quantity),
    qrDestination: (row.qrDestination as string) ?? undefined,
    qrUrl: row.qrUrl as string,
    network: (row.network as 'devnet' | 'mainnet-beta') ?? 'devnet',
    mintStatus: (row.mintStatus as 'pending' | 'minted' | 'stub') ?? 'stub',
    mintTxSignature: (row.mintTxSignature as string) ?? undefined,
    mintAddress: (row.mintAddress as string) ?? undefined,
    not_investment: true,
    not_prediction_market: true,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  };
}

// ─────────────────────────────────────────────────────────────
// Public API — all functions are async (D1 requires await)
// ─────────────────────────────────────────────────────────────

export async function saveCampaign(input: CampaignInput): Promise<CampaignRecord> {
  const now = new Date().toISOString();
  const record: CampaignRecord = {
    id: uuidv4(),
    namespace: input.namespace,
    campaignName: input.campaignName,
    businessName: input.businessName,
    campaignType: input.campaignType,
    description: input.description,
    cityOrEvent: input.cityOrEvent,
    offer: input.offer,
    imageUrl: input.imageUrl,
    expiration: input.expiration,
    quantity: input.quantity,
    qrDestination: input.qrDestination,
    qrUrl: input.qrUrl,
    network: input.network ?? 'devnet',
    mintStatus: 'stub',
    not_investment: true,
    not_prediction_market: true,
    createdAt: now,
    updatedAt: now,
  };

  const d1 = getD1();
  if (d1) {
    await d1SaveCampaign(d1, record);
    return record;
  }

  const backend = getBackend();

  if (backend === 'sqlite' && _db) {
    _db
      .prepare(`
        INSERT INTO campaigns (
          id, namespace, campaignName, businessName, campaignType,
          description, cityOrEvent, offer, imageUrl, expiration,
          quantity, qrDestination, qrUrl, network, mintStatus,
          mintTxSignature, mintAddress, not_investment, not_prediction_market,
          createdAt, updatedAt
        ) VALUES (
          @id, @namespace, @campaignName, @businessName, @campaignType,
          @description, @cityOrEvent, @offer, @imageUrl, @expiration,
          @quantity, @qrDestination, @qrUrl, @network, @mintStatus,
          @mintTxSignature, @mintAddress, 1, 1,
          @createdAt, @updatedAt
        )
      `)
      .run({
        ...record,
        mintTxSignature: record.mintTxSignature ?? null,
        mintAddress: record.mintAddress ?? null,
        imageUrl: record.imageUrl ?? null,
        expiration: record.expiration ?? null,
        qrDestination: record.qrDestination ?? null,
      });
    return record;
  }

  if (backend === 'json') {
    const all = readJSON();
    all.push(record);
    writeJSON(all);
    return record;
  }

  _memStore.set(record.namespace, record);
  return record;
}

export async function getCampaignByNamespace(ns: string): Promise<CampaignRecord | null> {
  const d1 = getD1();
  if (d1) return d1GetByNamespace(d1, ns);

  const backend = getBackend();

  if (backend === 'sqlite' && _db) {
    const row = _db
      .prepare('SELECT * FROM campaigns WHERE namespace = ?')
      .get(ns) as Record<string, unknown> | undefined;
    return row ? rowToRecord(row) : null;
  }

  if (backend === 'json') {
    const all = readJSON();
    return all.find((c) => c.namespace === ns) ?? null;
  }

  return _memStore.get(ns) ?? null;
}

export async function listCampaigns(): Promise<CampaignRecord[]> {
  const d1 = getD1();
  if (d1) return d1ListCampaigns(d1);

  const backend = getBackend();

  if (backend === 'sqlite' && _db) {
    const rows = _db
      .prepare('SELECT * FROM campaigns ORDER BY createdAt DESC')
      .all() as Record<string, unknown>[];
    return rows.map(rowToRecord);
  }

  if (backend === 'json') {
    return readJSON().reverse();
  }

  return Array.from(_memStore.values()).reverse();
}

export async function updateMintStatus(
  namespace: string,
  mintStatus: 'pending' | 'minted' | 'stub',
  mintTxSignature?: string,
  mintAddress?: string,
): Promise<CampaignRecord | null> {
  const now = new Date().toISOString();

  const d1 = getD1();
  if (d1) {
    await d1UpdateMintStatus(d1, namespace, mintStatus, mintTxSignature, mintAddress, now);
    return d1GetByNamespace(d1, namespace);
  }

  const backend = getBackend();

  if (backend === 'sqlite' && _db) {
    _db
      .prepare(`
        UPDATE campaigns SET mintStatus = @mintStatus, mintTxSignature = @mintTxSignature,
          mintAddress = @mintAddress, updatedAt = @updatedAt
        WHERE namespace = @namespace
      `)
      .run({
        mintStatus,
        mintTxSignature: mintTxSignature ?? null,
        mintAddress: mintAddress ?? null,
        updatedAt: now,
        namespace,
      });
    return getCampaignByNamespace(namespace);
  }

  if (backend === 'json') {
    const all = readJSON();
    const idx = all.findIndex((c) => c.namespace === namespace);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], mintStatus, mintTxSignature, mintAddress, updatedAt: now };
    writeJSON(all);
    return all[idx];
  }

  const existing = _memStore.get(namespace);
  if (!existing) return null;
  const updated = { ...existing, mintStatus, mintTxSignature, mintAddress, updatedAt: now };
  _memStore.set(namespace, updated);
  return updated;
}

export function getStoreBackendInfo(): { backend: StoreBackend | 'd1'; dbPath?: string; jsonPath?: string } {
  if (getD1()) return { backend: 'd1' };
  const backend = getBackend();
  return {
    backend,
    dbPath: backend === 'sqlite' ? DB_PATH : undefined,
    jsonPath: backend === 'json' ? JSON_PATH : undefined,
  };
}
