/**
 * Revenue Database Layer
 * SQLite-backed storage for client inquiries and booking requests.
 * Uses the same better-sqlite3 pattern as src/lib/auth/db.ts
 */

import Database from "better-sqlite3";
import path from "path";
import crypto from "crypto";
import type {
  ClientInquiry,
  BookingRequest,
  BudgetRange,
  ServiceCategory,
  CallType,
  LeadSource,
  LeadStatus,
} from "@/lib/troptions/revenue";
import { qualifyLead } from "@/lib/troptions/revenue";

const DB_PATH = path.join(process.cwd(), "data", "revenue.db");

let db: Database.Database | null = null;

export function getRevenueDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initRevenueSchema(db);
  }
  return db;
}

function initRevenueSchema(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      email       TEXT NOT NULL,
      phone       TEXT,
      company     TEXT,
      website     TEXT,
      budget_range TEXT NOT NULL DEFAULT 'not_specified',
      service_interest TEXT NOT NULL DEFAULT 'not_sure',
      timeline    TEXT,
      message     TEXT NOT NULL,
      consent_given INTEGER NOT NULL DEFAULT 0,
      source      TEXT NOT NULL DEFAULT 'website_contact',
      status      TEXT NOT NULL DEFAULT 'new',
      lead_score  INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS booking_requests (
      id              TEXT PRIMARY KEY,
      name            TEXT NOT NULL,
      email           TEXT NOT NULL,
      company         TEXT,
      preferred_date  TEXT,
      preferred_time  TEXT,
      timezone        TEXT,
      call_type       TEXT NOT NULL DEFAULT 'discovery',
      notes           TEXT,
      status          TEXT NOT NULL DEFAULT 'pending',
      created_at      TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_inquiries_status   ON inquiries(status);
    CREATE INDEX IF NOT EXISTS idx_inquiries_email    ON inquiries(email);
    CREATE INDEX IF NOT EXISTS idx_inquiries_created  ON inquiries(created_at);
    CREATE INDEX IF NOT EXISTS idx_bookings_email     ON booking_requests(email);
    CREATE INDEX IF NOT EXISTS idx_bookings_created   ON booking_requests(created_at);

    CREATE TABLE IF NOT EXISTS cis_requests (
      id                TEXT PRIMARY KEY,
      name              TEXT NOT NULL,
      email             TEXT NOT NULL,
      phone             TEXT,
      company           TEXT,
      entity_type       TEXT NOT NULL DEFAULT 'individual',
      jurisdiction      TEXT,
      purpose           TEXT NOT NULL,
      transaction_type  TEXT,
      estimated_amount  TEXT,
      consent_given     INTEGER NOT NULL DEFAULT 0,
      status            TEXT NOT NULL DEFAULT 'received',
      created_at        TEXT NOT NULL,
      updated_at        TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_cis_email   ON cis_requests(email);
    CREATE INDEX IF NOT EXISTS idx_cis_status  ON cis_requests(status);
    CREATE INDEX IF NOT EXISTS idx_cis_created ON cis_requests(created_at);

    CREATE TABLE IF NOT EXISTS pof_requests (
      id                TEXT PRIMARY KEY,
      name              TEXT NOT NULL,
      email             TEXT NOT NULL,
      phone             TEXT,
      company           TEXT,
      entity_type       TEXT NOT NULL DEFAULT 'individual',
      amount            TEXT NOT NULL,
      currency          TEXT NOT NULL DEFAULT 'USD',
      source_of_funds   TEXT NOT NULL,
      purpose           TEXT NOT NULL,
      jurisdiction      TEXT,
      bank_name         TEXT,
      transaction_type  TEXT NOT NULL DEFAULT 'deal_funding',
      timeline          TEXT,
      notes             TEXT,
      consent_given     INTEGER NOT NULL DEFAULT 0,
      status            TEXT NOT NULL DEFAULT 'received',
      created_at        TEXT NOT NULL,
      updated_at        TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_pof_email   ON pof_requests(email);
    CREATE INDEX IF NOT EXISTS idx_pof_status  ON pof_requests(status);
    CREATE INDEX IF NOT EXISTS idx_pof_created ON pof_requests(created_at);

    CREATE TABLE IF NOT EXISTS rwa_requests (
      id                TEXT PRIMARY KEY,
      name              TEXT NOT NULL,
      email             TEXT NOT NULL,
      phone             TEXT,
      company           TEXT,
      entity_type       TEXT NOT NULL DEFAULT 'individual',
      asset_class       TEXT NOT NULL,
      asset_description TEXT NOT NULL,
      estimated_value   TEXT NOT NULL,
      jurisdiction      TEXT NOT NULL,
      custody_preference TEXT NOT NULL DEFAULT 'troptions_custodian',
      has_existing_docs INTEGER NOT NULL DEFAULT 0,
      doc_types         TEXT,
      settlement_chain  TEXT NOT NULL DEFAULT 'xrpl',
      purpose           TEXT NOT NULL,
      timeline          TEXT,
      notes             TEXT,
      consent_given     INTEGER NOT NULL DEFAULT 0,
      status            TEXT NOT NULL DEFAULT 'received',
      created_at        TEXT NOT NULL,
      updated_at        TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_rwa_email   ON rwa_requests(email);
    CREATE INDEX IF NOT EXISTS idx_rwa_status  ON rwa_requests(status);
    CREATE INDEX IF NOT EXISTS idx_rwa_created ON rwa_requests(created_at);
  `);
}

// ─── Inquiries ────────────────────────────────────────────────────────────────

export interface CreateInquiryInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  budgetRange?: BudgetRange;
  serviceInterest?: ServiceCategory;
  timeline?: string;
  message: string;
  consentGiven: boolean;
}

function rowToInquiry(row: Record<string, unknown>): ClientInquiry {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: (row.phone as string) || undefined,
    company: (row.company as string) || undefined,
    website: (row.website as string) || undefined,
    budgetRange: (row.budget_range as BudgetRange) ?? "not_specified",
    serviceInterest: (row.service_interest as ServiceCategory) ?? "not_sure",
    timeline: (row.timeline as string) || undefined,
    message: row.message as string,
    consentGiven: row.consent_given === 1,
    source: (row.source as LeadSource) ?? "website_contact",
    status: (row.status as LeadStatus) ?? "new",
    leadScore: row.lead_score as number,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function createInquiry(input: CreateInquiryInput): ClientInquiry {
  const database = getRevenueDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const partial: Partial<ClientInquiry> = {
    id,
    name: input.name,
    email: input.email.toLowerCase().trim(),
    phone: input.phone,
    company: input.company,
    website: input.website,
    budgetRange: input.budgetRange ?? "not_specified",
    serviceInterest: input.serviceInterest ?? "not_sure",
    timeline: input.timeline,
    message: input.message,
    consentGiven: input.consentGiven,
    source: "website_contact" as LeadSource,
    status: "new" as LeadStatus,
    createdAt: now,
    updatedAt: now,
  };

  const leadScore = qualifyLead(partial as ClientInquiry);

  database
    .prepare(
      `INSERT INTO inquiries (id, name, email, phone, company, website,
        budget_range, service_interest, timeline, message,
        consent_given, source, status, lead_score, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      id,
      input.name.trim(),
      input.email.toLowerCase().trim(),
      input.phone?.trim() ?? null,
      input.company?.trim() ?? null,
      input.website?.trim() ?? null,
      input.budgetRange ?? "not_specified",
      input.serviceInterest ?? "not_sure",
      input.timeline?.trim() ?? null,
      input.message.trim(),
      input.consentGiven ? 1 : 0,
      "website_contact",
      "new",
      leadScore,
      now,
      now
    );

  return rowToInquiry(
    database.prepare("SELECT * FROM inquiries WHERE id = ?").get(id) as Record<string, unknown>
  );
}

export function listInquiries(limit = 100, offset = 0): ClientInquiry[] {
  const database = getRevenueDb();
  const rows = database
    .prepare("SELECT * FROM inquiries ORDER BY created_at DESC LIMIT ? OFFSET ?")
    .all(limit, offset) as Record<string, unknown>[];
  return rows.map(rowToInquiry);
}

export function getInquiry(id: string): ClientInquiry | null {
  const database = getRevenueDb();
  const row = database
    .prepare("SELECT * FROM inquiries WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
  return row ? rowToInquiry(row) : null;
}

export function updateInquiryStatus(id: string, status: LeadStatus): boolean {
  const database = getRevenueDb();
  const result = database
    .prepare("UPDATE inquiries SET status = ?, updated_at = ? WHERE id = ?")
    .run(status, new Date().toISOString(), id);
  return result.changes > 0;
}

export function getInquirySummary() {
  const database = getRevenueDb();
  const total = (database.prepare("SELECT COUNT(*) as n FROM inquiries").get() as { n: number }).n;
  const newLeads = (
    database
      .prepare("SELECT COUNT(*) as n FROM inquiries WHERE status = 'new'")
      .get() as { n: number }
  ).n;
  const qualified = (
    database
      .prepare("SELECT COUNT(*) as n FROM inquiries WHERE status = 'qualified'")
      .get() as { n: number }
  ).n;

  return { total, newLeads, qualified };
}

// ─── Booking Requests ─────────────────────────────────────────────────────────

export interface CreateBookingInput {
  name: string;
  email: string;
  company?: string;
  preferredDate?: string;
  preferredTime?: string;
  timezone?: string;
  callType?: CallType;
  notes?: string;
}

function rowToBooking(row: Record<string, unknown>): BookingRequest {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    company: (row.company as string) || undefined,
    preferredDate: (row.preferred_date as string) || undefined,
    preferredTime: (row.preferred_time as string) || undefined,
    timezone: (row.timezone as string) || undefined,
    callType: (row.call_type as CallType) ?? "discovery",
    notes: (row.notes as string) || undefined,
    status: (row.status as "pending" | "confirmed" | "cancelled") ?? "pending",
    createdAt: row.created_at as string,
  };
}

export function createBookingRequest(input: CreateBookingInput): BookingRequest {
  const database = getRevenueDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  database
    .prepare(
      `INSERT INTO booking_requests
        (id, name, email, company, preferred_date, preferred_time, timezone, call_type, notes, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      id,
      input.name.trim(),
      input.email.toLowerCase().trim(),
      input.company?.trim() ?? null,
      input.preferredDate?.trim() ?? null,
      input.preferredTime?.trim() ?? null,
      input.timezone?.trim() ?? null,
      input.callType ?? "discovery",
      input.notes?.trim() ?? null,
      "pending",
      now
    );

  return rowToBooking(
    database
      .prepare("SELECT * FROM booking_requests WHERE id = ?")
      .get(id) as Record<string, unknown>
  );
}

export function listBookingRequests(limit = 100, offset = 0): BookingRequest[] {
  const database = getRevenueDb();
  const rows = database
    .prepare("SELECT * FROM booking_requests ORDER BY created_at DESC LIMIT ? OFFSET ?")
    .all(limit, offset) as Record<string, unknown>[];
  return rows.map(rowToBooking);
}

export function getBookingSummary() {
  const database = getRevenueDb();
  const total = (
    database.prepare("SELECT COUNT(*) as n FROM booking_requests").get() as { n: number }
  ).n;
  const pending = (
    database
      .prepare("SELECT COUNT(*) as n FROM booking_requests WHERE status = 'pending'")
      .get() as { n: number }
  ).n;
  return { total, pending };
}

// ─── CIS Requests ─────────────────────────────────────────────────────────────

export interface CisRequestRow {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  entityType: string;
  jurisdiction?: string;
  purpose: string;
  transactionType?: string;
  estimatedAmount?: string;
  consentGiven: boolean;
  status: "received" | "under_review" | "complete" | "declined";
  createdAt: string;
  updatedAt: string;
}

export interface CreateCisRequestInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  entityType?: string;
  jurisdiction?: string;
  purpose: string;
  transactionType?: string;
  estimatedAmount?: string;
  consentGiven: boolean;
}

function rowToCis(row: Record<string, unknown>): CisRequestRow {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: (row.phone as string) || undefined,
    company: (row.company as string) || undefined,
    entityType: (row.entity_type as string) ?? "individual",
    jurisdiction: (row.jurisdiction as string) || undefined,
    purpose: row.purpose as string,
    transactionType: (row.transaction_type as string) || undefined,
    estimatedAmount: (row.estimated_amount as string) || undefined,
    consentGiven: row.consent_given === 1,
    status: (row.status as CisRequestRow["status"]) ?? "received",
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function createCisRequest(input: CreateCisRequestInput): CisRequestRow {
  const database = getRevenueDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  database
    .prepare(
      `INSERT INTO cis_requests
        (id, name, email, phone, company, entity_type, jurisdiction, purpose,
         transaction_type, estimated_amount, consent_given, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'received', ?, ?)`
    )
    .run(
      id,
      input.name.trim(),
      input.email.toLowerCase().trim(),
      input.phone?.trim() ?? null,
      input.company?.trim() ?? null,
      input.entityType?.trim() ?? "individual",
      input.jurisdiction?.trim() ?? null,
      input.purpose.trim(),
      input.transactionType?.trim() ?? null,
      input.estimatedAmount?.trim() ?? null,
      input.consentGiven ? 1 : 0,
      now,
      now
    );

  return rowToCis(
    database.prepare("SELECT * FROM cis_requests WHERE id = ?").get(id) as Record<string, unknown>
  );
}

export function listCisRequests(limit = 100, offset = 0): CisRequestRow[] {
  const database = getRevenueDb();
  const rows = database
    .prepare("SELECT * FROM cis_requests ORDER BY created_at DESC LIMIT ? OFFSET ?")
    .all(limit, offset) as Record<string, unknown>[];
  return rows.map(rowToCis);
}

export function getCisSummary() {
  const database = getRevenueDb();
  const total = (database.prepare("SELECT COUNT(*) as n FROM cis_requests").get() as { n: number }).n;
  const pending = (
    database.prepare("SELECT COUNT(*) as n FROM cis_requests WHERE status = 'received'").get() as { n: number }
  ).n;
  return { total, pending };
}

// ─── POF Requests ─────────────────────────────────────────────────────────────

export interface PofRequestRow {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  entityType: string;
  amount: string;
  currency: string;
  sourceOfFunds: string;
  purpose: string;
  jurisdiction?: string;
  bankName?: string;
  transactionType: string;
  timeline?: string;
  notes?: string;
  consentGiven: boolean;
  status: "received" | "under_review" | "verified" | "declined";
  createdAt: string;
  updatedAt: string;
}

export interface CreatePofRequestInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  entityType?: string;
  amount: string;
  currency?: string;
  sourceOfFunds: string;
  purpose: string;
  jurisdiction?: string;
  bankName?: string;
  transactionType?: string;
  timeline?: string;
  notes?: string;
  consentGiven: boolean;
}

function rowToPof(row: Record<string, unknown>): PofRequestRow {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: (row.phone as string) || undefined,
    company: (row.company as string) || undefined,
    entityType: (row.entity_type as string) ?? "individual",
    amount: row.amount as string,
    currency: (row.currency as string) ?? "USD",
    sourceOfFunds: row.source_of_funds as string,
    purpose: row.purpose as string,
    jurisdiction: (row.jurisdiction as string) || undefined,
    bankName: (row.bank_name as string) || undefined,
    transactionType: (row.transaction_type as string) ?? "deal_funding",
    timeline: (row.timeline as string) || undefined,
    notes: (row.notes as string) || undefined,
    consentGiven: row.consent_given === 1,
    status: (row.status as PofRequestRow["status"]) ?? "received",
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function createPofRequest(input: CreatePofRequestInput): PofRequestRow {
  const database = getRevenueDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  database
    .prepare(
      `INSERT INTO pof_requests
        (id, name, email, phone, company, entity_type, amount, currency,
         source_of_funds, purpose, jurisdiction, bank_name, transaction_type,
         timeline, notes, consent_given, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'received', ?, ?)`
    )
    .run(
      id,
      input.name.trim(),
      input.email.toLowerCase().trim(),
      input.phone?.trim() ?? null,
      input.company?.trim() ?? null,
      input.entityType?.trim() ?? "individual",
      input.amount.trim(),
      input.currency?.trim() ?? "USD",
      input.sourceOfFunds.trim(),
      input.purpose.trim(),
      input.jurisdiction?.trim() ?? null,
      input.bankName?.trim() ?? null,
      input.transactionType?.trim() ?? "deal_funding",
      input.timeline?.trim() ?? null,
      input.notes?.trim() ?? null,
      input.consentGiven ? 1 : 0,
      now,
      now
    );

  return rowToPof(
    database.prepare("SELECT * FROM pof_requests WHERE id = ?").get(id) as Record<string, unknown>
  );
}

export function listPofRequests(limit = 100, offset = 0): PofRequestRow[] {
  const database = getRevenueDb();
  const rows = database
    .prepare("SELECT * FROM pof_requests ORDER BY created_at DESC LIMIT ? OFFSET ?")
    .all(limit, offset) as Record<string, unknown>[];
  return rows.map(rowToPof);
}

export function getPofRequest(id: string): PofRequestRow | null {
  const database = getRevenueDb();
  const row = database.prepare("SELECT * FROM pof_requests WHERE id = ?").get(id) as Record<string, unknown> | undefined;
  return row ? rowToPof(row) : null;
}

export function updatePofStatus(id: string, status: PofRequestRow["status"]): boolean {
  const database = getRevenueDb();
  const result = database
    .prepare("UPDATE pof_requests SET status = ?, updated_at = ? WHERE id = ?")
    .run(status, new Date().toISOString(), id);
  return result.changes > 0;
}

export function getPofSummary() {
  const database = getRevenueDb();
  const total = (database.prepare("SELECT COUNT(*) as n FROM pof_requests").get() as { n: number }).n;
  const pending = (
    database.prepare("SELECT COUNT(*) as n FROM pof_requests WHERE status = 'received'").get() as { n: number }
  ).n;
  return { total, pending };
}

// ─── RWA Requests ─────────────────────────────────────────────────────────────

export interface RwaRequestRow {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  entityType: string;
  assetClass: string;
  assetDescription: string;
  estimatedValue: string;
  jurisdiction: string;
  custodyPreference: string;
  hasExistingDocs: boolean;
  docTypes?: string;
  settlementChain: string;
  purpose: string;
  timeline?: string;
  notes?: string;
  consentGiven: boolean;
  status: "received" | "under_review" | "approved" | "declined";
  createdAt: string;
  updatedAt: string;
}

export interface CreateRwaRequestInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  entityType?: string;
  assetClass: string;
  assetDescription: string;
  estimatedValue: string;
  jurisdiction: string;
  custodyPreference?: string;
  hasExistingDocs?: boolean;
  docTypes?: string;
  settlementChain?: string;
  purpose: string;
  timeline?: string;
  notes?: string;
  consentGiven: boolean;
}

function rowToRwa(row: Record<string, unknown>): RwaRequestRow {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: (row.phone as string) || undefined,
    company: (row.company as string) || undefined,
    entityType: (row.entity_type as string) ?? "individual",
    assetClass: row.asset_class as string,
    assetDescription: row.asset_description as string,
    estimatedValue: row.estimated_value as string,
    jurisdiction: row.jurisdiction as string,
    custodyPreference: (row.custody_preference as string) ?? "troptions_custodian",
    hasExistingDocs: row.has_existing_docs === 1,
    docTypes: (row.doc_types as string) || undefined,
    settlementChain: (row.settlement_chain as string) ?? "xrpl",
    purpose: row.purpose as string,
    timeline: (row.timeline as string) || undefined,
    notes: (row.notes as string) || undefined,
    consentGiven: row.consent_given === 1,
    status: (row.status as RwaRequestRow["status"]) ?? "received",
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function createRwaRequest(input: CreateRwaRequestInput): RwaRequestRow {
  const database = getRevenueDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  database
    .prepare(
      `INSERT INTO rwa_requests
        (id, name, email, phone, company, entity_type, asset_class, asset_description,
         estimated_value, jurisdiction, custody_preference, has_existing_docs, doc_types,
         settlement_chain, purpose, timeline, notes, consent_given, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'received', ?, ?)`
    )
    .run(
      id,
      input.name.trim(),
      input.email.toLowerCase().trim(),
      input.phone?.trim() ?? null,
      input.company?.trim() ?? null,
      input.entityType?.trim() ?? "individual",
      input.assetClass.trim(),
      input.assetDescription.trim(),
      input.estimatedValue.trim(),
      input.jurisdiction.trim(),
      input.custodyPreference?.trim() ?? "troptions_custodian",
      input.hasExistingDocs ? 1 : 0,
      input.docTypes?.trim() ?? null,
      input.settlementChain?.trim() ?? "xrpl",
      input.purpose.trim(),
      input.timeline?.trim() ?? null,
      input.notes?.trim() ?? null,
      input.consentGiven ? 1 : 0,
      now,
      now
    );

  return rowToRwa(
    database.prepare("SELECT * FROM rwa_requests WHERE id = ?").get(id) as Record<string, unknown>
  );
}

export function listRwaRequests(limit = 100, offset = 0): RwaRequestRow[] {
  const database = getRevenueDb();
  const rows = database
    .prepare("SELECT * FROM rwa_requests ORDER BY created_at DESC LIMIT ? OFFSET ?")
    .all(limit, offset) as Record<string, unknown>[];
  return rows.map(rowToRwa);
}

export function getRwaRequest(id: string): RwaRequestRow | null {
  const database = getRevenueDb();
  const row = database.prepare("SELECT * FROM rwa_requests WHERE id = ?").get(id) as Record<string, unknown> | undefined;
  return row ? rowToRwa(row) : null;
}

export function updateRwaStatus(id: string, status: RwaRequestRow["status"]): boolean {
  const database = getRevenueDb();
  const result = database
    .prepare("UPDATE rwa_requests SET status = ?, updated_at = ? WHERE id = ?")
    .run(status, new Date().toISOString(), id);
  return result.changes > 0;
}

export function getRwaSummary() {
  const database = getRevenueDb();
  const total = (database.prepare("SELECT COUNT(*) as n FROM rwa_requests").get() as { n: number }).n;
  const pending = (
    database.prepare("SELECT COUNT(*) as n FROM rwa_requests WHERE status = 'received'").get() as { n: number }
  ).n;
  return { total, pending };
}
