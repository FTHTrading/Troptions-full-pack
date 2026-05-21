import { TROPTIONS_PORTAL_COMPLIANCE_NOTICE } from "@/content/troptions/clientPortalRegistry";

export function ComplianceNotice() {
  return (
    <section className="cp-notice" aria-label="Compliance notice">
      {TROPTIONS_PORTAL_COMPLIANCE_NOTICE}
    </section>
  );
}
