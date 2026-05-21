// TROPTIONS Exchange OS — Lead Capture
// Submits to CRM webhook if configured, logs locally otherwise.

export interface LeadSubmission {
  partnerType: string;
  name: string;
  email: string;
  company?: string;
  packageInterest?: string;
  message?: string;
  source: string;
  timestamp: string;
}

export async function submitLead(
  data: Omit<LeadSubmission, "timestamp">
): Promise<{ ok: boolean; demoMode: boolean; error?: string }> {
  const lead: LeadSubmission = {
    ...data,
    timestamp: new Date().toISOString(),
  };

  const webhookUrl = process.env.TROPTIONS_CRM_WEBHOOK_URL;

  if (!webhookUrl) {
    // Demo mode — log and return success
    console.info("[Exchange OS Lead - Demo]", lead);
    return { ok: true, demoMode: true };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });

    if (!res.ok) {
      return {
        ok: false,
        demoMode: false,
        error: `CRM webhook returned HTTP ${res.status}`,
      };
    }

    return { ok: true, demoMode: false };
  } catch (err) {
    return {
      ok: false,
      demoMode: false,
      error: err instanceof Error ? err.message : "CRM webhook failed.",
    };
  }
}
