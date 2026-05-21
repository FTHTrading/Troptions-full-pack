import { OpenClawLayout } from "@/components/openclaw/OpenClawLayout";
import { OPENCLAW_ALLOWED_ACTIONS, OPENCLAW_BLOCKED_ACTIONS, OPENCLAW_REQUIRED_APPROVALS } from "@/content/troptions/openClawPolicyRegistry";

export default function AdminOpenClawPoliciesPage() {
  return (
    <OpenClawLayout title="OpenClaw Policies" intro="Allowed actions, blocked actions, and required approvals.">
      <section className="openclaw-panel">
        <h3>Allowed Actions</h3>
        <div className="openclaw-tag-list">
          {OPENCLAW_ALLOWED_ACTIONS.map((action) => (
            <span key={action} className="openclaw-tag">{action}</span>
          ))}
        </div>
      </section>
      <section className="openclaw-panel">
        <h3>Blocked Actions</h3>
        <div className="openclaw-tag-list">
          {OPENCLAW_BLOCKED_ACTIONS.map((action) => (
            <span key={action} className="openclaw-tag openclaw-tag-blocked">{action}</span>
          ))}
        </div>
      </section>
      <section className="openclaw-panel">
        <h3>Required Approvals</h3>
        <ul className="openclaw-list">
          {OPENCLAW_REQUIRED_APPROVALS.map((approval) => (
            <li key={approval}>{approval}</li>
          ))}
        </ul>
      </section>
    </OpenClawLayout>
  );
}
