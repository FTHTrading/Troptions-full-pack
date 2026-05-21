import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';

const dbPath = path.join(process.cwd(), 'data', 'auth.db');

let db: Database.Database | null = null;

export function getDb() {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initSchema();
  }
  return db;
}

function initSchema() {
  const database = getDb();
  
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    );
    
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
  `);
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function createUser(email: string, password: string) {
  const database = getDb();
  const id = crypto.randomUUID();
  const passwordHash = hashPassword(password);
  
  try {
    database.prepare(`
      INSERT INTO users (id, email, password_hash)
      VALUES (?, ?, ?)
    `).run(id, email.toLowerCase(), passwordHash);
    
    return { id, email: email.toLowerCase() };
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Email already registered');
    }
    throw error;
  }
}

export function getUserByEmail(email: string) {
  const database = getDb();
  return database.prepare(`
    SELECT id, email, password_hash FROM users WHERE email = ?
  `).get(email.toLowerCase()) as any;
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function createSession(userId: string, expiresInDays: number = 30) {
  const database = getDb();
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
  
  database.prepare(`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (?, ?, ?)
  `).run(sessionId, userId, expiresAt.toISOString());
  
  return sessionId;
}

export function getSessionUser(sessionId: string) {
  const database = getDb();
  const session = database.prepare(`
    SELECT user_id, expires_at FROM sessions WHERE id = ?
  `).get(sessionId) as any;
  
  if (!session) return null;
  
  if (new Date(session.expires_at) < new Date()) {
    database.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
    return null;
  }
  
  const user = database.prepare(`
    SELECT id, email FROM users WHERE id = ?
  `).get(session.user_id) as any;
  
  return user || null;
}

export function deleteSession(sessionId: string) {
  const database = getDb();
  database.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
}
