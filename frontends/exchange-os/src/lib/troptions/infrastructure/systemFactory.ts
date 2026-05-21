/**
 * TROPTIONS Infrastructure — System Factory Templates
 */

import type { TroptionsSystemFactoryTemplate, SystemType } from "./types";

export const SYSTEM_FACTORY_TEMPLATES: TroptionsSystemFactoryTemplate[] = [
  {
    id: "tpl-main-site",
    templateName: "TROPTIONS Main Client Site",
    systemType: "troptions_main_site",
    description:
      "Full institutional website: services, pricing, trust, contact, booking, onboarding, insights.",
    requiredRoutes: ["/", "/services", "/pricing", "/contact", "/trust", "/book", "/onboarding"],
    requiredModules: ["main_site", "revenue_dashboard"],
    requiredAdapters: ["email", "calendar"],
    requiredEnvVars: ["SITE_URL", "CONTACT_EMAIL", "BOOKING_CALENDAR_KEY"],
    requiredComplianceNotices: [
      "TROPTIONS is not a bank or licensed payroll provider.",
      "This platform does not guarantee investment returns.",
    ],
    requiredLaunchChecklistItems: [
      "All main pages reviewed",
      "Contact form tested",
      "Booking flow tested",
      "Trust/disclaimer pages present",
      "Contract signed",
    ],
    estimatedSetupFeeCategory: "starter",
    estimatedMonthlyCategory: "starter",
  },
  {
    id: "tpl-payops",
    templateName: "TROPTIONS PayOps System",
    systemType: "troptions_payops",
    description:
      "Provider-neutral payout operations: batches, payees, receipts, compliance, audit, adapters.",
    requiredRoutes: [
      "/troptions-cloud/[namespace]/payops",
      "/troptions-cloud/[namespace]/payops/payees",
      "/troptions-cloud/[namespace]/payops/batches",
      "/troptions-cloud/[namespace]/payops/receipts",
    ],
    requiredModules: ["payops"],
    requiredAdapters: ["payment", "bank", "accounting"],
    requiredEnvVars: ["PAYOPS_NAMESPACE", "PROVIDER_API_KEY", "PAYMENT_SECRET"],
    requiredComplianceNotices: [
      "Execution requires a production-ready approved provider adapter.",
      "No live payout without real provider credentials.",
      "TROPTIONS is not a bank or licensed payroll provider.",
    ],
    requiredLaunchChecklistItems: [
      "Payment adapter credentials configured",
      "Bank partner adapter approved",
      "Compliance review completed",
      "Test batch run and approved",
    ],
    estimatedSetupFeeCategory: "institutional",
    estimatedMonthlyCategory: "institutional",
  },
  {
    id: "tpl-sponsors",
    templateName: "TROPTIONS Sponsor Activation System",
    systemType: "troptions_sponsors",
    description: "Sponsor management, activation campaigns, QR, receipt packets.",
    requiredRoutes: [
      "/troptions-cloud/[namespace]/sponsors",
    ],
    requiredModules: ["sponsors"],
    requiredAdapters: ["email", "crm"],
    requiredEnvVars: ["SPONSORS_NAMESPACE", "CRM_KEY"],
    requiredComplianceNotices: [
      "Sponsor activations are operational tools, not investment instruments.",
    ],
    requiredLaunchChecklistItems: [
      "Sponsor intake form reviewed",
      "CRM adapter configured",
      "Activation campaign tested",
    ],
    estimatedSetupFeeCategory: "growth",
    estimatedMonthlyCategory: "growth",
  },
  {
    id: "tpl-event-os",
    templateName: "TROPTIONS Event OS System",
    systemType: "troptions_event_os",
    description:
      "Event operations: locations, QR campaigns, check-in, lead capture, staff OS.",
    requiredRoutes: ["/troptions-cloud/[namespace]/event-os"],
    requiredModules: ["event_os"],
    requiredAdapters: ["maps", "email", "crm"],
    requiredEnvVars: ["EVENT_NAMESPACE", "MAPS_API_KEY"],
    requiredComplianceNotices: [
      "Event operations are tools for event management, not financial services.",
    ],
    requiredLaunchChecklistItems: [
      "Event locations configured",
      "QR campaign tested",
      "Lead capture tested",
    ],
    estimatedSetupFeeCategory: "growth",
    estimatedMonthlyCategory: "growth",
  },
  {
    id: "tpl-ai-concierge",
    templateName: "TROPTIONS AI Concierge System",
    systemType: "troptions_ai_concierge",
    description: "AI-powered concierge and assistant for client namespaces.",
    requiredRoutes: ["/troptions-cloud/[namespace]/ai"],
    requiredModules: ["ai_concierge"],
    requiredAdapters: ["ai"],
    requiredEnvVars: ["AI_API_KEY", "AI_MODEL_ID"],
    requiredComplianceNotices: [
      "AI concierge is an operational assistant tool. Outputs are not professional advice.",
    ],
    requiredLaunchChecklistItems: [
      "AI API credentials configured",
      "Model tested",
      "Response compliance reviewed",
    ],
    estimatedSetupFeeCategory: "growth",
    estimatedMonthlyCategory: "growth",
  },
  {
    id: "tpl-trust-audit",
    templateName: "TROPTIONS Trust & Audit Portal",
    systemType: "troptions_trust_audit",
    description: "Audit trail, proof packets, compliance documentation, trust records.",
    requiredRoutes: ["/troptions-cloud/[namespace]/audit"],
    requiredModules: ["trust_audit"],
    requiredAdapters: ["storage"],
    requiredEnvVars: ["AUDIT_NAMESPACE", "STORAGE_KEY"],
    requiredComplianceNotices: [
      "Audit records are operational records, not legal certifications.",
    ],
    requiredLaunchChecklistItems: [
      "Audit trail tested",
      "Proof packet generation tested",
    ],
    estimatedSetupFeeCategory: "institutional",
    estimatedMonthlyCategory: "institutional",
  },
  {
    id: "tpl-client-portal",
    templateName: "TROPTIONS Client Onboarding Portal",
    systemType: "troptions_client_portal",
    description: "Client onboarding, KYB, intake forms, account setup.",
    requiredRoutes: ["/troptions-cloud/[namespace]/overview"],
    requiredModules: ["client_portal"],
    requiredAdapters: ["email", "compliance"],
    requiredEnvVars: ["CLIENT_NAMESPACE", "COMPLIANCE_KEY"],
    requiredComplianceNotices: [
      "Onboarding records are for business operations only.",
    ],
    requiredLaunchChecklistItems: [
      "Intake form reviewed",
      "Compliance adapter tested",
      "Onboarding flow reviewed",
    ],
    estimatedSetupFeeCategory: "growth",
    estimatedMonthlyCategory: "growth",
  },
];

export function getTemplateBySystemType(
  systemType: SystemType
): TroptionsSystemFactoryTemplate | undefined {
  return SYSTEM_FACTORY_TEMPLATES.find((t) => t.systemType === systemType);
}
