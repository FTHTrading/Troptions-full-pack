export interface HandleValidationResult {
  ok: boolean;
  handle: string;
  isAvailable: boolean;
  message: string;
  suggestedHandles?: readonly string[];
}

export function validateHandle(handle: string): HandleValidationResult {
  // Validate handle format
  const handleRegex = /^[a-z0-9._-]{3,20}$/;
  if (!handleRegex.test(handle)) {
    return {
      ok: false,
      handle,
      isAvailable: false,
      message: "Handle must be 3-20 characters, lowercase, numbers, dots, dashes, or underscores only",
    };
  }

  // Check against reserved handles (in production, query database)
  const reservedHandles = [
    "admin",
    "troptions",
    "system",
    "support",
    "noreply",
    "test",
    "demo",
    "root",
    "api",
    "dev",
  ];

  if (reservedHandles.includes(handle.toLowerCase())) {
    return {
      ok: false,
      handle,
      isAvailable: false,
      message: "This handle is reserved and cannot be used",
    };
  }

  // For now, all valid handles are available (in production, check database)
  return {
    ok: true,
    handle,
    isAvailable: true,
    message: `Handle "${handle}" is available`,
  };
}

export function generateHandleSuggestions(baseHandle: string): readonly string[] {
  const suggestions = [
    `${baseHandle}1`,
    `${baseHandle}.troptions`,
    `${baseHandle}-wallet`,
    `${baseHandle}_v1`,
    `troptions.${baseHandle}`,
  ];
  return suggestions;
}

export function normalizeHandle(handle: string): string {
  return handle.toLowerCase().trim().replace(/\s+/g, ".");
}
