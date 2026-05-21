export interface TelcomCapability {
  id: string;
  label: string;
  description: string;
  provider: "telnyx";
  status: "gated" | "ready" | "dry-run";
  gatesRequired: string[];
  tcpaRequired: boolean;
  ctiaRequired: boolean;
}

export const TELECOM_CAPABILITIES: TelcomCapability[] = [
  {
    id: "sms-notifications",
    label: "SMS Notifications",
    description: "Transactional SMS notifications for institutional workflow events",
    provider: "telnyx",
    status: "gated",
    gatesRequired: ["provider", "compliance", "tcpa-consent"],
    tcpaRequired: true,
    ctiaRequired: true,
  },
  {
    id: "voice-concierge",
    label: "Voice Concierge",
    description: "AI-assisted voice routing for institutional client support",
    provider: "telnyx",
    status: "gated",
    gatesRequired: ["provider", "legal", "compliance"],
    tcpaRequired: true,
    ctiaRequired: false,
  },
  {
    id: "kyc-verification-sms",
    label: "KYC Verification SMS",
    description: "SMS-based OTP for KYC verification workflows",
    provider: "telnyx",
    status: "gated",
    gatesRequired: ["provider", "compliance"],
    tcpaRequired: true,
    ctiaRequired: false,
  },
  {
    id: "workflow-alerts",
    label: "Workflow Alerts",
    description: "Proof room and approval workflow alert notifications",
    provider: "telnyx",
    status: "dry-run",
    gatesRequired: ["provider"],
    tcpaRequired: true,
    ctiaRequired: false,
  },
  {
    id: "institutional-sms",
    label: "Institutional SMS Campaigns",
    description: "CTIA-compliant bulk SMS campaigns for institutional announcements",
    provider: "telnyx",
    status: "gated",
    gatesRequired: ["provider", "compliance", "legal", "tcpa-consent", "ctia-registration"],
    tcpaRequired: true,
    ctiaRequired: true,
  },
];

export const TELECOM_COMPLIANCE_REQUIREMENTS = [
  { id: "tcpa", label: "TCPA Consent", description: "Written prior express consent required before any SMS/voice contact", required: true },
  { id: "ctia", label: "CTIA Registration", description: "Campaign Registry (TCR) registration for 10DLC messaging", required: true },
  { id: "optout", label: "Opt-Out Mechanism", description: "STOP keyword support and suppression list management", required: true },
  { id: "data-retention", label: "Consent Record Retention", description: "Consent records retained for minimum 4 years", required: true },
  { id: "do-not-call", label: "Do-Not-Call Compliance", description: "National DNC registry scrubbing before voice outreach", required: true },
];

export const TELECOM_DISCLAIMER =
  "Telecom capabilities are subject to TCPA, CTIA, and applicable telecom compliance requirements. All communications require prior express consent. Troptions provides institutional operating infrastructure subject to provider, legal, compliance, custody, jurisdiction, and board approval gates.";
