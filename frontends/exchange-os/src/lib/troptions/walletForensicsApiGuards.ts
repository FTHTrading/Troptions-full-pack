import { NextRequest, NextResponse } from "next/server";

export interface GuardSuccess {
  readonly ok: true;
  readonly payload: unknown;
}

export interface GuardFailure {
  readonly ok: false;
  readonly response: NextResponse;
}

export type GuardResult = GuardSuccess | GuardFailure;

interface IdempotentRecord {
  readonly key: string;
  readonly responseBody: unknown;
  readonly status: number;
}

const SENSITIVE_KEY_PATTERN = /private.?key|mnemonic|seed|secret|passphrase|familyseed|wallet.?key/i;
const FORBIDDEN_ACTION_PATTERN = /\b(sign|submit|broadcast|send|transfer|move\s*funds?)\b/i;

const globalStore = globalThis as typeof globalThis & {
  __walletForensicsIdempotencyStore?: Map<string, IdempotentRecord>;
};

function getIdempotencyStore(): Map<string, IdempotentRecord> {
  if (!globalStore.__walletForensicsIdempotencyStore) {
    globalStore.__walletForensicsIdempotencyStore = new Map<string, IdempotentRecord>();
  }
  return globalStore.__walletForensicsIdempotencyStore;
}

export function requireAuth(request: NextRequest): NextResponse | null {
  const authHeader = request.headers.get("authorization");
  const apiKeyHeader = request.headers.get("x-api-key");
  if (!authHeader && !apiKeyHeader) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized: provide authorization or x-api-key header." },
      { status: 401 },
    );
  }
  return null;
}

function collectPathViolations(input: unknown, path: string, violations: string[]): void {
  if (!input || typeof input !== "object") return;

  if (Array.isArray(input)) {
    input.forEach((value, index) => collectPathViolations(value, `${path}[${index}]`, violations));
    return;
  }

  for (const [key, value] of Object.entries(input)) {
    const nextPath = path ? `${path}.${key}` : key;
    if (SENSITIVE_KEY_PATTERN.test(key)) {
      violations.push(`Sensitive field rejected: ${nextPath}`);
    }

    if (typeof value === "string" && FORBIDDEN_ACTION_PATTERN.test(value)) {
      violations.push(`Forbidden action text detected at ${nextPath}`);
    }

    collectPathViolations(value, nextPath, violations);
  }
}

export function validateReadOnlyPayload(payload: unknown): string[] {
  const violations: string[] = [];
  collectPathViolations(payload, "", violations);
  return violations;
}

export async function guardPostRequest(request: NextRequest): Promise<GuardResult> {
  const authError = requireAuth(request);
  if (authError) return { ok: false, response: authError };

  const idempotencyKey = request.headers.get("x-idempotency-key");
  if (!idempotencyKey) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: "Missing x-idempotency-key header." },
        { status: 400 },
      ),
    };
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 }),
    };
  }

  const violations = validateReadOnlyPayload(payload);
  if (violations.length > 0) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          ok: false,
          error: "Payload rejected by forensic safety policy.",
          violations,
        },
        { status: 400 },
      ),
    };
  }

  const replay = getIdempotencyStore().get(idempotencyKey);
  if (replay) {
    const response = NextResponse.json(replay.responseBody, { status: replay.status });
    response.headers.set("x-idempotent-replay", "true");
    return { ok: false, response };
  }

  return { ok: true, payload };
}

export function storeIdempotentResponse(
  request: NextRequest,
  responseBody: unknown,
  status: number,
): NextResponse {
  const key = request.headers.get("x-idempotency-key");
  if (key) {
    getIdempotencyStore().set(key, {
      key,
      responseBody,
      status,
    });
  }

  return NextResponse.json(responseBody, { status });
}
