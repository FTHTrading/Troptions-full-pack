// TROPTIONS Exchange OS — Browser wallet vault
// Wallets are encrypted with AES-256-GCM using a user PIN.
// Everything stays in localStorage — keys never leave the browser.

import type { ChainType } from "./wallet-gen";

export interface VaultWallet {
  id: string;
  chain: ChainType;
  label: string;
  address: string;
  encryptedSecret: string; // base64 AES-GCM ciphertext
  iv: string;              // base64 IV
  createdAt: string;
}

interface VaultData {
  version: 1;
  salt: string; // base64 random salt for PBKDF2
  wallets: VaultWallet[];
}

const VAULT_KEY = "xos-wallet-vault";

// ── Encoding helpers ──────────────────────────────────────────────────────────

function toB64(buf: Uint8Array): string {
  return btoa(String.fromCharCode(...buf));
}
function fromB64(b64: string): Uint8Array<ArrayBuffer> {
  const arr = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return new Uint8Array(arr.buffer as ArrayBuffer);
}

// ── Key derivation ─────────────────────────────────────────────────────────────

async function deriveKey(pin: string, saltB64: string): Promise<CryptoKey> {
  const salt = fromB64(saltB64);
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(pin),
    "PBKDF2",
    false,
    ["deriveKey"] as KeyUsage[],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 200_000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"] as KeyUsage[],
  );
}

// ── Encrypt / decrypt ─────────────────────────────────────────────────────────

async function encryptString(plain: string, key: CryptoKey): Promise<{ ciphertext: string; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plain));
  return { ciphertext: toB64(new Uint8Array(ct)), iv: toB64(iv) };
}

async function decryptString(ciphertext: string, ivB64: string, key: CryptoKey): Promise<string> {
  const iv = fromB64(ivB64);
  const ct = fromB64(ciphertext);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return new TextDecoder().decode(plain);
}

// ── Public vault API ──────────────────────────────────────────────────────────

export function vaultExists(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(VAULT_KEY);
}

export function listVaultWallets(): VaultWallet[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VAULT_KEY);
    if (!raw) return [];
    const data: VaultData = JSON.parse(raw);
    return data.wallets ?? [];
  } catch {
    return [];
  }
}

/** Create a new empty vault with this PIN. Call once when no vault exists. */
export function initVault(pin: string): void {
  const salt = toB64(crypto.getRandomValues(new Uint8Array(32)));
  const vault: VaultData = { version: 1, salt, wallets: [] };
  localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
  // store a session-level "unlocked" marker so the user isn't asked again this session
  sessionStorage.setItem("xos-vault-pin", pin);
}

/** Return cached session PIN if user already unlocked this tab. */
export function getSessionPin(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("xos-vault-pin");
}

export function setSessionPin(pin: string): void {
  sessionStorage.setItem("xos-vault-pin", pin);
}

export function clearSessionPin(): void {
  sessionStorage.removeItem("xos-vault-pin");
}

/** Verify a PIN against the vault (attempts to decrypt the first wallet, or just checks vault exists). */
export async function verifyPin(pin: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem(VAULT_KEY);
  if (!raw) return false;
  try {
    const vault: VaultData = JSON.parse(raw);
    if (vault.wallets.length === 0) {
      // No wallets yet — can't verify cryptographically, just accept
      return true;
    }
    const key = await deriveKey(pin, vault.salt);
    const w = vault.wallets[0];
    await decryptString(w.encryptedSecret, w.iv, key);
    return true;
  } catch {
    return false;
  }
}

/** Add a generated wallet to the vault (encrypts the secret with the given PIN). */
export async function addWallet(
  pin: string,
  wallet: { id: string; chain: ChainType; label: string; address: string; secret: string },
): Promise<void> {
  const raw = localStorage.getItem(VAULT_KEY)!;
  const vault: VaultData = JSON.parse(raw);
  const key = await deriveKey(pin, vault.salt);
  const { ciphertext, iv } = await encryptString(wallet.secret, key);
  vault.wallets.push({
    id: wallet.id,
    chain: wallet.chain,
    label: wallet.label,
    address: wallet.address,
    encryptedSecret: ciphertext,
    iv,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
}

/** Reveal the secret for a specific wallet. Throws if PIN is wrong. */
export async function revealSecret(walletId: string, pin: string): Promise<string> {
  const raw = localStorage.getItem(VAULT_KEY)!;
  const vault: VaultData = JSON.parse(raw);
  const w = vault.wallets.find((x) => x.id === walletId);
  if (!w) throw new Error("Wallet not found");
  const key = await deriveKey(pin, vault.salt);
  return decryptString(w.encryptedSecret, w.iv, key);
}

/** Permanently delete a wallet from the vault. */
export function deleteWallet(walletId: string): void {
  const raw = localStorage.getItem(VAULT_KEY)!;
  const vault: VaultData = JSON.parse(raw);
  vault.wallets = vault.wallets.filter((w) => w.id !== walletId);
  localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
}

/** Export a wallet's full data as a JSON string the user can save offline. */
export async function exportWalletBackup(
  walletId: string,
  pin: string,
): Promise<string> {
  const wallets = listVaultWallets();
  const w = wallets.find((x) => x.id === walletId);
  if (!w) throw new Error("Wallet not found");
  const secret = await revealSecret(walletId, pin);
  return JSON.stringify(
    {
      troptions_wallet_backup: true,
      version: 1,
      exportedAt: new Date().toISOString(),
      chain: w.chain,
      label: w.label,
      address: w.address,
      secret,
      warning: "Keep this file private. Anyone with this file can access your wallet.",
    },
    null,
    2,
  );
}
