interface KeyRecord {
  kid: string;
  secret: string;
  enabled?: boolean;
}

interface KeySetConfig {
  activeKid: string;
  keys: KeyRecord[];
}

function parseKeySet(raw: string | undefined, envName: string): KeySetConfig | null {
  if (!raw || !raw.trim()) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`${envName} must be valid JSON.`);
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error(`${envName} must be an object with activeKid and keys.`);
  }

  const activeKid = (parsed as { activeKid?: unknown }).activeKid;
  const keys = (parsed as { keys?: unknown }).keys;

  if (typeof activeKid !== "string" || !activeKid.trim()) {
    throw new Error(`${envName}.activeKid must be a non-empty string.`);
  }

  if (!Array.isArray(keys) || keys.length === 0) {
    throw new Error(`${envName}.keys must be a non-empty array.`);
  }

  const normalizedKeys = keys.map((entry) => {
    if (!entry || typeof entry !== "object") {
      throw new Error(`${envName}.keys entries must be objects.`);
    }

    const kid = (entry as { kid?: unknown }).kid;
    const secret = (entry as { secret?: unknown }).secret;
    const enabled = (entry as { enabled?: unknown }).enabled;

    if (typeof kid !== "string" || !kid.trim()) {
      throw new Error(`${envName}.keys[].kid must be a non-empty string.`);
    }

    if (typeof secret !== "string" || secret.length < 32) {
      throw new Error(`${envName}.keys[].secret must be at least 32 characters.`);
    }

    if (enabled !== undefined && typeof enabled !== "boolean") {
      throw new Error(`${envName}.keys[].enabled must be boolean when provided.`);
    }

    return {
      kid,
      secret,
      enabled,
    };
  });

  if (!normalizedKeys.some((entry) => entry.kid === activeKid && entry.enabled !== false)) {
    throw new Error(`${envName}.activeKid must reference an enabled key.`);
  }

  return {
    activeKid,
    keys: normalizedKeys,
  };
}

function enabledKeys(config: KeySetConfig): KeyRecord[] {
  return config.keys.filter((entry) => entry.enabled !== false);
}

export interface JwtVerificationKey {
  kid: string;
  secret: string;
}

export function getJwtVerificationKeys(tokenKid?: string): JwtVerificationKey[] {
  const keySet = parseKeySet(process.env.TROPTIONS_JWT_KEYS_JSON, "TROPTIONS_JWT_KEYS_JSON");

  if (keySet) {
    const keys = enabledKeys(keySet);
    if (tokenKid) {
      return keys.filter((entry) => entry.kid === tokenKid).map(({ kid, secret }) => ({ kid, secret }));
    }

    const activeFirst = [
      ...keys.filter((entry) => entry.kid === keySet.activeKid),
      ...keys.filter((entry) => entry.kid !== keySet.activeKid),
    ];
    return activeFirst.map(({ kid, secret }) => ({ kid, secret }));
  }

  const legacySecret = process.env.TROPTIONS_JWT_SECRET;
  if (!legacySecret) return [];
  if (legacySecret.length < 32) {
    throw new Error("TROPTIONS_JWT_SECRET must be at least 32 characters.");
  }

  return [{ kid: "legacy", secret: legacySecret }];
}

export interface AuditSigningKey {
  kid: string;
  secret: string;
}

export function getActiveAuditSigningKey(): AuditSigningKey | null {
  const keySet = parseKeySet(process.env.TROPTIONS_AUDIT_EXPORT_KEYS_JSON, "TROPTIONS_AUDIT_EXPORT_KEYS_JSON");
  if (keySet) {
    const active = keySet.keys.find((entry) => entry.kid === keySet.activeKid && entry.enabled !== false);
    if (!active) {
      throw new Error("Active audit signing key is not available.");
    }

    return {
      kid: active.kid,
      secret: active.secret,
    };
  }

  const secret = process.env.TROPTIONS_AUDIT_EXPORT_SECRET;
  const keyId = process.env.TROPTIONS_AUDIT_EXPORT_KEY_ID;
  if (!secret && !keyId) return null;

  if (!secret) {
    throw new Error("TROPTIONS_AUDIT_EXPORT_SECRET is not configured.");
  }

  if (!keyId) {
    throw new Error("TROPTIONS_AUDIT_EXPORT_KEY_ID is not configured.");
  }

  if (secret.length < 32) {
    throw new Error("TROPTIONS_AUDIT_EXPORT_SECRET must be at least 32 characters.");
  }

  return {
    kid: keyId,
    secret,
  };
}
