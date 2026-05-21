/**
 * TROPTIONS Infrastructure — Mock Data
 * All data is simulation-only. No live execution.
 */

import type {
  TroptionsNamespace,
  TroptionsClientSystem,
  TroptionsProviderAdapter,
  TroptionsDeploymentTarget,
  TroptionsDeploymentRecord,
  TroptionsInfrastructureHealthCheck,
  TroptionsAuditEvent,
  TroptionsBillingReadinessRecord,
  TroptionsLaunchChecklist,
  TroptionsProvisioningPlan,
  InfrastructureDashboardSummary,
} from "./types";

export function getMockNamespaces(): TroptionsNamespace[] {
  return [
    {
      id: "ns-001",
      slug: "troptions",
      displayName: "TROPTIONS Primary",
      clientName: "TROPTIONS",
      status: "live",
      enabledModules: ["main_site", "revenue_dashboard", "trust_audit"],
      deploymentTargetIds: ["dt-001"],
      adapterIds: ["ad-001", "ad-002"],
      billingPackage: "enterprise",
      complianceStatus: "approved",
      launchTargetDate: null,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
      notes: "Primary TROPTIONS namespace — live.",
    },
    {
      id: "ns-002",
      slug: "troptions-payops",
      displayName: "TROPTIONS PayOps",
      clientName: "TROPTIONS",
      status: "configured",
      enabledModules: ["payops"],
      deploymentTargetIds: [],
      adapterIds: [],
      billingPackage: "institutional",
      complianceStatus: "in_review",
      launchTargetDate: "2026-07-01",
      createdAt: "2025-06-01T00:00:00Z",
      updatedAt: "2025-12-01T00:00:00Z",
      notes: "PayOps namespace — adapter credentials required.",
    },
    {
      id: "ns-003",
      slug: "troptions-event-os",
      displayName: "TROPTIONS Event OS",
      clientName: "TROPTIONS",
      status: "provisioning",
      enabledModules: ["event_os"],
      deploymentTargetIds: [],
      adapterIds: [],
      billingPackage: "growth",
      complianceStatus: "not_started",
      launchTargetDate: "2026-09-01",
      createdAt: "2025-09-01T00:00:00Z",
      updatedAt: "2025-11-01T00:00:00Z",
      notes: "Event OS namespace — in provisioning.",
    },
    {
      id: "ns-004",
      slug: "troptions-ai",
      displayName: "TROPTIONS AI Concierge",
      clientName: "TROPTIONS",
      status: "ready_for_review",
      enabledModules: ["ai_concierge"],
      deploymentTargetIds: ["dt-002"],
      adapterIds: ["ad-003"],
      billingPackage: "growth",
      complianceStatus: "in_review",
      launchTargetDate: "2026-08-01",
      createdAt: "2025-08-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
      notes: "AI Concierge — ready for review.",
    },
  ];
}

export function getMockClientSystems(): TroptionsClientSystem[] {
  return [
    {
      id: "sys-001",
      namespaceId: "ns-001",
      systemType: "troptions_main_site",
      displayName: "TROPTIONS Main Site",
      description: "Primary client-facing website for TROPTIONS.",
      status: "live",
      requiredRoutes: ["/", "/services", "/pricing", "/contact", "/trust"],
      requiredModules: ["main_site", "revenue_dashboard"],
      requiredAdapters: ["email", "calendar"],
      requiredEnvVars: ["SITE_URL", "CONTACT_EMAIL"],
      complianceNotices: ["TROPTIONS is not a bank or payroll provider."],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
    },
    {
      id: "sys-002",
      namespaceId: "ns-002",
      systemType: "troptions_payops",
      displayName: "TROPTIONS PayOps",
      description: "Payout operations management system.",
      status: "configured",
      requiredRoutes: ["/troptions-cloud/[namespace]/payops"],
      requiredModules: ["payops"],
      requiredAdapters: ["payment", "bank", "accounting"],
      requiredEnvVars: ["PAYOPS_NAMESPACE", "PROVIDER_API_KEY"],
      complianceNotices: [
        "Execution requires a production-ready approved provider adapter.",
        "No live payout without real provider credentials.",
      ],
      createdAt: "2025-06-01T00:00:00Z",
      updatedAt: "2025-12-01T00:00:00Z",
    },
  ];
}

export function getMockAdapters(namespaceId: string): TroptionsProviderAdapter[] {
  return [
    {
      id: "ad-001",
      namespaceId,
      adapterName: "Email Notification",
      category: "email",
      description: "Compatible with approved email notification providers.",
      status: "approved",
      supportsExecution: false,
      isConfigured: true,
      credentialsRequired: ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"],
      credentialsPresent: ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"],
      webhookUrl: null,
      sandboxMode: false,
      notes: "Email only — no money movement.",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
    },
    {
      id: "ad-002",
      namespaceId,
      adapterName: "Calendar Booking",
      category: "calendar",
      description: "Compatible with approved calendar and booking providers.",
      status: "approved",
      supportsExecution: false,
      isConfigured: true,
      credentialsRequired: ["CALENDAR_API_KEY"],
      credentialsPresent: ["CALENDAR_API_KEY"],
      webhookUrl: null,
      sandboxMode: false,
      notes: "Booking only — no financial execution.",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2025-01-01T00:00:00Z",
    },
    {
      id: "ad-003",
      namespaceId,
      adapterName: "AI Model",
      category: "ai",
      description: "Compatible with approved AI model providers.",
      status: "sandbox",
      supportsExecution: false,
      isConfigured: false,
      credentialsRequired: ["AI_API_KEY", "AI_MODEL_ID"],
      credentialsPresent: [],
      webhookUrl: null,
      sandboxMode: true,
      notes: "Credentials required before production use.",
      createdAt: "2025-08-01T00:00:00Z",
      updatedAt: "2025-11-01T00:00:00Z",
    },
    {
      id: "ad-004",
      namespaceId,
      adapterName: "Payment Partner",
      category: "payment",
      description: "Compatible with approved payment execution partners.",
      status: "credentials_required",
      supportsExecution: true,
      isConfigured: false,
      credentialsRequired: [
        "PAYMENT_PROVIDER_KEY",
        "PAYMENT_PROVIDER_SECRET",
        "PROVIDER_ACCOUNT_ID",
      ],
      credentialsPresent: [],
      webhookUrl: null,
      sandboxMode: true,
      notes:
        "Execution is disabled until credentials are configured and production approval is confirmed.",
      createdAt: "2025-06-01T00:00:00Z",
      updatedAt: "2025-12-01T00:00:00Z",
    },
    {
      id: "ad-005",
      namespaceId,
      adapterName: "Deployment Provider",
      category: "deployment",
      description: "Compatible with approved deployment targets.",
      status: "not_configured",
      supportsExecution: false,
      isConfigured: false,
      credentialsRequired: ["DEPLOY_TOKEN", "DEPLOY_SITE_ID"],
      credentialsPresent: [],
      webhookUrl: null,
      sandboxMode: true,
      notes: "Deployment token required.",
      createdAt: "2025-09-01T00:00:00Z",
      updatedAt: "2025-11-01T00:00:00Z",
    },
  ];
}

export function getMockDeploymentTargets(
  namespaceId: string
): TroptionsDeploymentTarget[] {
  return [
    {
      id: "dt-001",
      namespaceId,
      targetType: "netlify",
      displayName: "Netlify — Main Site",
      repoUrl: "https://github.com/FTHTrading/Troptions",
      buildCommand: "pnpm build",
      deployHook: null,
      domainName: "troptions.com",
      subdomain: null,
      dnsStatus: "active",
      credentialsPresent: false,
      status: "live",
      notes: "Main production deployment.",
    },
    {
      id: "dt-002",
      namespaceId,
      targetType: "cloudflare_pages",
      displayName: "Cloudflare Pages — AI Concierge",
      repoUrl: null,
      buildCommand: null,
      deployHook: null,
      domainName: null,
      subdomain: "ai.troptions.com",
      dnsStatus: "unconfigured",
      credentialsPresent: false,
      status: "planned",
      notes: "Credentials required before deployment.",
    },
  ];
}

export function getMockDeploymentRecords(
  namespaceId: string
): TroptionsDeploymentRecord[] {
  return [
    {
      id: "dr-001",
      namespaceId,
      targetId: "dt-001",
      version: "v1.0.0",
      triggeredBy: "admin",
      status: "live",
      buildStartedAt: "2025-01-01T09:00:00Z",
      buildCompletedAt: "2025-01-01T09:12:00Z",
      deployStartedAt: "2025-01-01T09:13:00Z",
      deployCompletedAt: "2025-01-01T09:15:00Z",
      deploymentUrl: "https://troptions.com",
      customDomain: "troptions.com",
      rollbackNotes: "",
      errorMessage: null,
      createdAt: "2025-01-01T09:00:00Z",
    },
    {
      id: "dr-002",
      namespaceId,
      targetId: "dt-002",
      version: "v0.1.0",
      triggeredBy: "admin",
      status: "credentials_required",
      buildStartedAt: null,
      buildCompletedAt: null,
      deployStartedAt: null,
      deployCompletedAt: null,
      deploymentUrl: null,
      customDomain: null,
      rollbackNotes: "",
      errorMessage: "Deployment credentials not configured.",
      createdAt: "2026-01-01T00:00:00Z",
    },
  ];
}

export function getMockHealthChecks(): TroptionsInfrastructureHealthCheck[] {
  const now = new Date().toISOString();
  return [
    {
      id: "hc-001",
      namespaceId: null,
      checkType: "build",
      status: "healthy",
      lastCheckedAt: now,
      responseTimeMs: null,
      message: "Last build passed (exit 0).",
      details: {},
    },
    {
      id: "hc-002",
      namespaceId: null,
      checkType: "api",
      status: "healthy",
      lastCheckedAt: now,
      responseTimeMs: 42,
      message: "API routes responding normally.",
      details: {},
    },
    {
      id: "hc-003",
      namespaceId: null,
      checkType: "database",
      status: "healthy",
      lastCheckedAt: now,
      responseTimeMs: 8,
      message: "Mock data layer operational.",
      details: { note: "Production requires SQLite or Postgres migration." },
    },
    {
      id: "hc-004",
      namespaceId: null,
      checkType: "adapter",
      status: "degraded",
      lastCheckedAt: now,
      responseTimeMs: null,
      message: "2 adapters require credentials configuration.",
      details: { adaptersNeedingCredentials: 2 },
    },
    {
      id: "hc-005",
      namespaceId: null,
      checkType: "payment_readiness",
      status: "degraded",
      lastCheckedAt: now,
      responseTimeMs: null,
      message:
        "Payment execution adapters not configured. Manual-only readiness active.",
      details: {},
    },
    {
      id: "hc-006",
      namespaceId: null,
      checkType: "compliance",
      status: "healthy",
      lastCheckedAt: now,
      responseTimeMs: null,
      message: "Compliance notices present on all applicable pages.",
      details: {},
    },
  ];
}

export function getMockAuditEvents(): TroptionsAuditEvent[] {
  return [
    {
      id: "ae-001",
      actor: "admin",
      namespaceId: "ns-001",
      action: "namespace_created",
      entityType: "namespace",
      entityId: "ns-001",
      severity: "info",
      beforeSummary: null,
      afterSummary: "Namespace created: troptions (draft)",
      notes: "Initial provisioning.",
      timestamp: "2024-01-01T00:00:00Z",
    },
    {
      id: "ae-002",
      actor: "admin",
      namespaceId: "ns-002",
      action: "adapter_registered",
      entityType: "adapter",
      entityId: "ad-004",
      severity: "warning",
      beforeSummary: null,
      afterSummary: "Payment adapter registered — credentials_required",
      notes: "Execution disabled until credentials configured.",
      timestamp: "2025-06-15T10:00:00Z",
    },
    {
      id: "ae-003",
      actor: "system",
      namespaceId: null,
      action: "health_check_run",
      entityType: "infrastructure",
      entityId: "global",
      severity: "info",
      beforeSummary: null,
      afterSummary: "Health check: build healthy, adapter degraded.",
      notes: "",
      timestamp: new Date().toISOString(),
    },
  ];
}

export function getMockBillingReadiness(
  namespaceId: string
): TroptionsBillingReadinessRecord {
  return {
    id: `br-${namespaceId}`,
    namespaceId,
    billingPackage: "institutional",
    setupFeeCategory: "institutional",
    monthlyFeeCategory: "institutional",
    paymentMethodStatus: "not_provided",
    invoiceStatus: "not_issued",
    contractStatus: "not_started",
    depositStatus: "not_required",
    billingContactName: null,
    billingContactEmail: null,
    billingReadinessStatus: "package_selected",
    notes: "Billing contact and payment method required.",
    createdAt: "2025-06-01T00:00:00Z",
    updatedAt: "2025-06-01T00:00:00Z",
  };
}

export function getMockLaunchChecklist(
  namespaceId: string
): TroptionsLaunchChecklist {
  return {
    id: `lc-${namespaceId}`,
    namespaceId,
    items: [
      { key: "main_pages_ready", label: "Main Pages Ready", status: "complete", notes: "", requiredForLaunch: true },
      { key: "modules_configured", label: "Modules Configured", status: "pending", notes: "AI concierge module needs credentials.", requiredForLaunch: true },
      { key: "adapters_reviewed", label: "Adapters Reviewed", status: "pending", notes: "Payment adapter needs credentials.", requiredForLaunch: true },
      { key: "compliance_notices", label: "Compliance Notices Present", status: "complete", notes: "", requiredForLaunch: true },
      { key: "pricing_contract", label: "Pricing & Contract Reviewed", status: "pending", notes: "Contract not started.", requiredForLaunch: true },
      { key: "payment_readiness", label: "Payment Readiness Reviewed", status: "pending", notes: "Manual-only at this stage.", requiredForLaunch: true },
      { key: "deployment_target", label: "Deployment Target Reviewed", status: "complete", notes: "", requiredForLaunch: true },
      { key: "domain_reviewed", label: "Domain Reviewed", status: "pending", notes: "DNS configuration needed.", requiredForLaunch: true },
      { key: "admin_access", label: "Admin Access Reviewed", status: "complete", notes: "", requiredForLaunch: true },
      { key: "launch_approval", label: "Launch Approval Recorded", status: "pending", notes: "Awaiting final sign-off.", requiredForLaunch: true },
    ],
    overallStatus: "in_progress",
    approvedBy: null,
    approvedAt: null,
    createdAt: "2025-06-01T00:00:00Z",
    updatedAt: new Date().toISOString(),
  };
}

export function getMockProvisioningPlan(
  namespaceId: string
): TroptionsProvisioningPlan {
  return {
    id: `pp-${namespaceId}`,
    namespaceId,
    systemType: "troptions_payops",
    planTitle: "TROPTIONS PayOps — Provisioning Plan",
    requiredRoutes: ["/troptions-cloud/[namespace]/payops"],
    requiredModules: ["payops"],
    requiredAdapters: ["payment", "bank", "accounting"],
    requiredEnvVars: ["PAYOPS_NAMESPACE", "PROVIDER_API_KEY"],
    complianceNotices: [
      "Execution requires production-ready adapter approval.",
      "No live payout without real provider credentials.",
    ],
    estimatedSetupFeeCategory: "institutional",
    estimatedMonthlyCategory: "institutional",
    launchChecklistItems: [
      "Payment adapter credentials configured",
      "Bank partner adapter approved",
      "Compliance review completed",
      "Contract signed",
      "Test batch approved",
    ],
    status: "draft",
    createdAt: "2025-06-01T00:00:00Z",
    approvedAt: null,
    notes: "PayOps provisioning plan — awaiting adapter credentials.",
  };
}

export function getMockInfraDashboardSummary(): InfrastructureDashboardSummary {
  const events = getMockAuditEvents();
  return {
    totalNamespaces: 4,
    liveNamespaces: 1,
    systemsProvisioning: 1,
    systemsReadyForLaunch: 1,
    deploymentsPending: 1,
    deploymentsFailed: 0,
    adaptersNeedingCredentials: 2,
    complianceWarnings: 1,
    billingReadyCount: 0,
    recentAuditEvents: events.slice(-5),
  };
}
