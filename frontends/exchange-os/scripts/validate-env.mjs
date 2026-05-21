function hasValue(name) {
  const value = process.env[name];
  return Boolean(value && String(value).trim());
}

function validateJson(envName, errors) {
  const raw = process.env[envName];
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    errors.push(`${envName} must be valid JSON.`);
    return null;
  }
}

const errors = [];
const warnings = [];
const env = process.env.NODE_ENV || "development";
const dbAdapter = (process.env.TROPTIONS_DB_ADAPTER || "sqlite").toLowerCase();

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

  if (dbAdapter === "sqlite") {
    warnings.push("TROPTIONS_DB_ADAPTER is sqlite in production. Prefer postgres for production durability.");
  }
}

if (dbAdapter === "postgres" && !hasValue("DATABASE_URL")) {
  errors.push("DATABASE_URL is required when TROPTIONS_DB_ADAPTER=postgres.");
}

const jwtKeyset = validateJson("TROPTIONS_JWT_KEYS_JSON", errors);
if (!jwtKeyset && !hasValue("TROPTIONS_JWT_SECRET")) {
  errors.push("JWT auth is not configured. Set TROPTIONS_JWT_KEYS_JSON or TROPTIONS_JWT_SECRET.");
}

if (jwtKeyset) {
  if (!jwtKeyset.activeKid || !Array.isArray(jwtKeyset.keys) || jwtKeyset.keys.length === 0) {
    errors.push("TROPTIONS_JWT_KEYS_JSON must include activeKid and non-empty keys[].");
  }
}

const auditKeyset = validateJson("TROPTIONS_AUDIT_EXPORT_KEYS_JSON", errors);
if (!auditKeyset && !(hasValue("TROPTIONS_AUDIT_EXPORT_SECRET") && hasValue("TROPTIONS_AUDIT_EXPORT_KEY_ID"))) {
  errors.push("Audit signing key is not configured. Set TROPTIONS_AUDIT_EXPORT_KEYS_JSON or legacy audit env values.");
}

if (hasValue("TROPTIONS_AUDIT_EXPORT_SECRET") && process.env.TROPTIONS_AUDIT_EXPORT_SECRET.length < 32) {
  errors.push("TROPTIONS_AUDIT_EXPORT_SECRET must be at least 32 characters.");
}

if (env === "production" && hasValue("TROPTIONS_CONTROL_PLANE_TOKEN")) {
  warnings.push("TROPTIONS_CONTROL_PLANE_TOKEN is set in production. Prefer JWT auth and keep static token disabled.");
}

for (const warning of warnings) {
  console.warn("[validate-env][warn]", warning);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error("[validate-env][error]", error);
  }
  process.exit(1);
}

console.log("[validate-env] Environment validation passed.");
