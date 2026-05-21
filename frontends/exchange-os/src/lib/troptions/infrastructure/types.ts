/**
 * TROPTIONS Infrastructure Control Plane — Core Types
 *
 * TROPTIONS owns the control plane.
 * Approved providers execute regulated money movement.
 * TROPTIONS records, approves, routes, audits, and manages the workflow.
 *
 * No FTH / FTHX / FTHG / Future Tech Holdings references.
 * No fake live execution without real provider confirmation.
 */

// ─── Namespace ────────────────────────────────────────────────────────────────

export type NamespaceStatus =
  | "draft"
  | "provisioning"
  | "configured"
  | "ready_for_review"
  | "approved_for_launch"
  | "live"
  | "suspended"
  | "archived";

export type SystemType =
  | "troptions_main_site"
  | "troptions_cloud"
  | "troptions_payops"
  | "troptions_sponsors"
  | "troptions_event_os"
  | "troptions_ai_concierge"
  | "troptions_mapping"
  | "troptions_trust_audit"
  | "troptions_client_portal"
  | "troptions_revenue_dashboard";

export type ModuleStatus =
  | "not_enabled"
  | "enabled"
  | "configured"
  | "needs_credentials"
  | "needs_review"
  | "ready"
  | "live"
  | "disabled";

export type DeploymentTargetType =
  | "local"
  | "netlify"
  | "vercel"
  | "cloudflare_pages"
  | "github_pages"
  | "custom_server"
  | "manual";

export type DeploymentStatus =
  | "not_started"
  | "planned"
  | "credentials_required"
  | "build_pending"
  | "build_passed"
  | "deploy_pending"
  | "deployed"
  | "failed"
  | "domain_pending"
  | "live";

export type AdapterCategory =
  | "payment"
  | "payroll"
  | "wallet"
  | "stablecoin"
  | "card"
  | "bank"
  | "accounting"
  | "crm"
  | "calendar"
  | "email"
  | "sms"
  | "maps"
  | "ai"
  | "compliance"
  | "analytics"
  | "storage"
  | "domain_dns"
  | "deployment";

export type AdapterStatus =
  | "not_configured"
  | "credentials_required"
  | "sandbox"
  | "pending_review"
  | "approved"
  | "production_ready"
  | "disabled"
  | "error";

export type InfraAuditAction =
  | "namespace_created"
  | "namespace_updated"
  | "namespace_status_changed"
  | "system_created"
  | "system_updated"
  | "module_enabled"
  | "module_configured"
  | "module_disabled"
  | "deployment_created"
  | "deployment_updated"
  | "deployment_triggered"
  | "deployment_failed"
  | "adapter_registered"
  | "adapter_configured"
  | "adapter_approved"
  | "adapter_disabled"
  | "health_check_run"
  | "billing_record_created"
  | "billing_record_updated"
  | "launch_checklist_generated"
  | "launch_checklist_approved"
  | "provisioning_plan_generated"
  | "provisioning_plan_approved";

export type InfraAuditSeverity = "info" | "warning" | "critical";

export type BillingPackage =
  | "starter"
  | "growth"
  | "institutional"
  | "enterprise"
  | "custom";

export type ContractStatus =
  | "not_started"
  | "draft"
  | "sent"
  | "signed"
  | "active"
  | "expired"
  | "terminated";

export type InvoiceStatus =
  | "not_issued"
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "void";

export type BillingReadinessStatus =
  | "not_started"
  | "package_selected"
  | "contract_pending"
  | "payment_method_pending"
  | "deposit_pending"
  | "billing_ready"
  | "blocked";

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface TroptionsNamespace {
  id: string;
  slug: string;
  displayName: string;
  clientName: string;
  status: NamespaceStatus;
  enabledModules: string[];
  deploymentTargetIds: string[];
  adapterIds: string[];
  billingPackage: BillingPackage | null;
  complianceStatus: "not_started" | "in_review" | "approved" | "blocked";
  launchTargetDate: string | null;
  createdAt: string;
  updatedAt: string;
  notes: string;
}

export interface TroptionsClientSystem {
  id: string;
  namespaceId: string;
  systemType: SystemType;
  displayName: string;
  description: string;
  status: NamespaceStatus;
  requiredRoutes: string[];
  requiredModules: string[];
  requiredAdapters: AdapterCategory[];
  requiredEnvVars: string[];
  complianceNotices: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TroptionsSystemModule {
  id: string;
  namespaceId: string;
  systemId: string;
  moduleName: string;
  moduleType: SystemType;
  status: ModuleStatus;
  requiredCredentials: string[];
  configuredAt: string | null;
  notes: string;
}

export interface TroptionsDeploymentTarget {
  id: string;
  namespaceId: string;
  targetType: DeploymentTargetType;
  displayName: string;
  repoUrl: string | null;
  buildCommand: string | null;
  deployHook: string | null;
  domainName: string | null;
  subdomain: string | null;
  dnsStatus: "unconfigured" | "pending" | "propagating" | "active";
  credentialsPresent: boolean;
  status: DeploymentStatus;
  notes: string;
}

export interface TroptionsDeploymentRecord {
  id: string;
  namespaceId: string;
  targetId: string;
  version: string;
  triggeredBy: string;
  status: DeploymentStatus;
  buildStartedAt: string | null;
  buildCompletedAt: string | null;
  deployStartedAt: string | null;
  deployCompletedAt: string | null;
  deploymentUrl: string | null;
  customDomain: string | null;
  rollbackNotes: string;
  errorMessage: string | null;
  createdAt: string;
}

export interface TroptionsProviderAdapter {
  id: string;
  namespaceId: string;
  adapterName: string;
  category: AdapterCategory;
  description: string;
  status: AdapterStatus;
  supportsExecution: boolean;
  isConfigured: boolean;
  credentialsRequired: string[];
  credentialsPresent: string[];
  webhookUrl: string | null;
  sandboxMode: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface TroptionsInfrastructureHealthCheck {
  id: string;
  namespaceId: string | null;
  checkType:
    | "build"
    | "api"
    | "database"
    | "adapter"
    | "deployment"
    | "namespace"
    | "audit"
    | "payment_readiness"
    | "compliance";
  status: "healthy" | "degraded" | "error" | "unknown";
  lastCheckedAt: string;
  responseTimeMs: number | null;
  message: string;
  details: Record<string, unknown>;
}

export interface TroptionsAuditEvent {
  id: string;
  actor: string;
  namespaceId: string | null;
  action: InfraAuditAction;
  entityType: string;
  entityId: string;
  severity: InfraAuditSeverity;
  beforeSummary: string | null;
  afterSummary: string | null;
  notes: string;
  timestamp: string;
}

export interface TroptionsProvisioningPlan {
  id: string;
  namespaceId: string;
  systemType: SystemType;
  planTitle: string;
  requiredRoutes: string[];
  requiredModules: string[];
  requiredAdapters: AdapterCategory[];
  requiredEnvVars: string[];
  complianceNotices: string[];
  estimatedSetupFeeCategory: BillingPackage;
  estimatedMonthlyCategory: BillingPackage;
  launchChecklistItems: string[];
  status: "draft" | "reviewed" | "approved" | "executing" | "complete";
  createdAt: string;
  approvedAt: string | null;
  notes: string;
}

export interface TroptionsLaunchChecklist {
  id: string;
  namespaceId: string;
  items: TroptionsLaunchChecklistItem[];
  overallStatus: "not_started" | "in_progress" | "complete" | "blocked";
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TroptionsLaunchChecklistItem {
  key: string;
  label: string;
  status: "pending" | "complete" | "blocked" | "not_applicable";
  notes: string;
  requiredForLaunch: boolean;
}

export interface TroptionsBillingReadinessRecord {
  id: string;
  namespaceId: string;
  billingPackage: BillingPackage | null;
  setupFeeCategory: BillingPackage | null;
  monthlyFeeCategory: BillingPackage | null;
  paymentMethodStatus: "not_provided" | "provided" | "verified";
  invoiceStatus: InvoiceStatus;
  contractStatus: ContractStatus;
  depositStatus: "not_required" | "pending" | "received";
  billingContactName: string | null;
  billingContactEmail: string | null;
  billingReadinessStatus: BillingReadinessStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface TroptionsSystemFactoryTemplate {
  id: string;
  templateName: string;
  systemType: SystemType;
  description: string;
  requiredRoutes: string[];
  requiredModules: string[];
  requiredAdapters: AdapterCategory[];
  requiredEnvVars: string[];
  requiredComplianceNotices: string[];
  requiredLaunchChecklistItems: string[];
  estimatedSetupFeeCategory: BillingPackage;
  estimatedMonthlyCategory: BillingPackage;
}

// ─── Label Maps ──────────────────────────────────────────────────────────────

export const NAMESPACE_STATUS_LABELS: Record<NamespaceStatus, string> = {
  draft: "Draft",
  provisioning: "Provisioning",
  configured: "Configured",
  ready_for_review: "Ready for Review",
  approved_for_launch: "Approved for Launch",
  live: "Live",
  suspended: "Suspended",
  archived: "Archived",
};

export const DEPLOYMENT_STATUS_LABELS: Record<DeploymentStatus, string> = {
  not_started: "Not Started",
  planned: "Planned",
  credentials_required: "Credentials Required",
  build_pending: "Build Pending",
  build_passed: "Build Passed",
  deploy_pending: "Deploy Pending",
  deployed: "Deployed",
  failed: "Failed",
  domain_pending: "Domain Pending",
  live: "Live",
};

export const ADAPTER_STATUS_LABELS: Record<AdapterStatus, string> = {
  not_configured: "Not Configured",
  credentials_required: "Credentials Required",
  sandbox: "Sandbox",
  pending_review: "Pending Review",
  approved: "Approved",
  production_ready: "Production Ready",
  disabled: "Disabled",
  error: "Error",
};

export const ADAPTER_CATEGORY_LABELS: Record<AdapterCategory, string> = {
  payment: "Payment",
  payroll: "Payroll",
  wallet: "Wallet",
  stablecoin: "Stablecoin",
  card: "Card",
  bank: "Bank",
  accounting: "Accounting",
  crm: "CRM",
  calendar: "Calendar",
  email: "Email",
  sms: "SMS",
  maps: "Maps",
  ai: "AI Model",
  compliance: "Compliance / KYC",
  analytics: "Analytics",
  storage: "Storage",
  domain_dns: "Domain / DNS",
  deployment: "Deployment Provider",
};

export const SYSTEM_TYPE_LABELS: Record<SystemType, string> = {
  troptions_main_site: "TROPTIONS Main Site",
  troptions_cloud: "TROPTIONS Cloud",
  troptions_payops: "TROPTIONS PayOps",
  troptions_sponsors: "TROPTIONS Sponsors",
  troptions_event_os: "TROPTIONS Event OS",
  troptions_ai_concierge: "TROPTIONS AI Concierge",
  troptions_mapping: "TROPTIONS Mapping",
  troptions_trust_audit: "TROPTIONS Trust & Audit",
  troptions_client_portal: "TROPTIONS Client Portal",
  troptions_revenue_dashboard: "TROPTIONS Revenue Dashboard",
};

// ─── Dashboard Summary ────────────────────────────────────────────────────────

export interface InfrastructureDashboardSummary {
  totalNamespaces: number;
  liveNamespaces: number;
  systemsProvisioning: number;
  systemsReadyForLaunch: number;
  deploymentsPending: number;
  deploymentsFailed: number;
  adaptersNeedingCredentials: number;
  complianceWarnings: number;
  billingReadyCount: number;
  recentAuditEvents: TroptionsAuditEvent[];
}
