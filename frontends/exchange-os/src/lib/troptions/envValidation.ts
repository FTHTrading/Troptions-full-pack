import { getActiveAuditSigningKey, getJwtVerificationKeys } from "@/lib/troptions/keyManagement";

export interface EnvValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

function hasValue(name: string): boolean {
  const value = process.env[name];
  return Boolean(value && value.trim());
}

export function validateTroptionsEnvironment(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const env = process.env.NODE_ENV ?? "development";
  const configuredAdapter = (process.env.TROPTIONS_DB_ADAPTER ?? "sqlite").toLowerCase();

  if (env === "production") {
    if (!hasValue("TROPTIONS_DEPLOYMENT_ID")) {
      errors.push("TROPTIONS_DEPLOYMENT_ID is required in production.");
    }

    if (!hasValue("TROPTIONS_RELEASE_CHANNEL")) {
      errors.push("TROPTIONS_RELEASE_CHANNEL is required in production.");
    }

    const writesEnabled = process.env.TROPTIONS_CONTROL_PLANE_WRITES_ENABLED;
    if (writesEnabled !== "0" && writesEnabled !== "1") {
      errors.push("TROPTIONS_CONTROL_PLANE_WRITES_ENABLED must be '0' or '1' in production.");
    }

    if (configuredAdapter === "sqlite") {
      warnings.push("TROPTIONS_DB_ADAPTER is sqlite in production. Prefer postgres for production durability.");
    }
  }

  if (configuredAdapter === "postgres" && !hasValue("DATABASE_URL")) {
    errors.push("DATABASE_URL is required when TROPTIONS_DB_ADAPTER=postgres.");
  }

  try {
    const jwtKeys = getJwtVerificationKeys();
    if (jwtKeys.length === 0) {
      errors.push("No JWT verification key is configured. Set TROPTIONS_JWT_KEYS_JSON or TROPTIONS_JWT_SECRET.");
    }
  } catch (error) {
    errors.push((error as Error).message);
  }

  try {
    const auditKey = getActiveAuditSigningKey();
    if (!auditKey) {
      errors.push(
        "No audit signing key is configured. Set TROPTIONS_AUDIT_EXPORT_KEYS_JSON or legacy audit key env values.",
      );
    }
  } catch (error) {
    errors.push((error as Error).message);
  }

  if (env === "production" && hasValue("TROPTIONS_CONTROL_PLANE_TOKEN")) {
    warnings.push(
      "TROPTIONS_CONTROL_PLANE_TOKEN is set in production. Prefer JWT key-based auth and disable static token auth.",
    );
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}
