export type SecurityStatus = 'implemented' | 'active' | 'required' | 'documented';

export interface SecurityControl {
  id: string;
  title: string;
  status: SecurityStatus;
  clientVisible: boolean;
  description?: string;
  requiredFor?: string;
}

export const SECURITY_CONTROLS: readonly SecurityControl[] = [
  {
    id: 'no-private-keys',
    title: 'No Private Keys in Repo',
    status: 'implemented',
    clientVisible: true,
    description: 'Repository is audited for any committed private keys, seed phrases, or wallet secrets. None are present.',
    requiredFor: 'All levels',
  },
  {
    id: 'secrets-management',
    title: 'Secrets Management (CF Secrets + Vercel Env)',
    status: 'implemented',
    clientVisible: true,
    description: 'All API keys and secrets are stored in Cloudflare Secrets and Vercel environment variables, never in source code.',
    requiredFor: 'All levels',
  },
  {
    id: 'non-custodial',
    title: 'Non-Custodial Architecture',
    status: 'implemented',
    clientVisible: true,
    description: 'TROPTIONS does not hold, manage, or control client funds or tokens. Enforced architecturally and via feature flags.',
    requiredFor: 'All levels',
  },
  {
    id: 'cloudflare-waf',
    title: 'Cloudflare WAF / DDoS Protection',
    status: 'active',
    clientVisible: true,
    description: 'All production routes are protected by Cloudflare WAF with DDoS mitigation and rate limiting at the edge.',
    requiredFor: 'All levels',
  },
  {
    id: 'rate-limiting',
    title: 'API Rate Limiting',
    status: 'required',
    clientVisible: false,
    description: 'Per-client API rate limiting to prevent abuse and protect infrastructure. Required before enterprise volume.',
    requiredFor: 'Level 3+',
  },
  {
    id: 'audit-logging',
    title: 'Audit Log Retention',
    status: 'required',
    clientVisible: false,
    description: 'All sensitive operations logged with 90-day minimum retention. Required for compliance and incident investigation.',
    requiredFor: 'Level 3+',
  },
  {
    id: 'multisig',
    title: 'Multisig for Treasury Operations',
    status: 'required',
    clientVisible: true,
    description: 'Treasury wallet operations require multi-signature approval. Single-key treasury is a critical risk.',
    requiredFor: 'Level 3+',
  },
  {
    id: 'hardware-wallet',
    title: 'Hardware Wallet for Treasury',
    status: 'required',
    clientVisible: false,
    description: 'Treasury signing keys should be stored on hardware wallets (Ledger/Trezor), not software wallets.',
    requiredFor: 'Level 3+',
  },
  {
    id: 'key-rotation',
    title: 'API Key Rotation Policy',
    status: 'documented',
    clientVisible: false,
    description: 'API keys are rotated on a defined schedule. Rotation runbook is documented.',
    requiredFor: 'Level 2+',
  },
  {
    id: 'dependency-scanning',
    title: 'Dependency Vulnerability Scanning',
    status: 'required',
    clientVisible: false,
    description: 'npm audit and automated dependency scanning before each deployment.',
    requiredFor: 'Level 3+',
  },
  {
    id: 'incident-response',
    title: 'Incident Response Plan',
    status: 'documented',
    clientVisible: true,
    description: 'Incident response runbook published in command-center. Covers detection, escalation, and recovery.',
    requiredFor: 'Level 3+',
  },
  {
    id: 'rbac',
    title: 'Admin RBAC',
    status: 'required',
    clientVisible: false,
    description: 'Role-based access control for admin routes. Required before enterprise onboarding.',
    requiredFor: 'Level 3+',
  },
  {
    id: 'backups',
    title: 'Data Backup and Restore',
    status: 'required',
    clientVisible: false,
    description: 'Automated daily backups with tested restore procedure. Required before enterprise volume.',
    requiredFor: 'Level 4+',
  },
] as const;

export const SECURITY_SUMMARY = {
  implemented: SECURITY_CONTROLS.filter(c => c.status === 'implemented').length,
  active: SECURITY_CONTROLS.filter(c => c.status === 'active').length,
  documented: SECURITY_CONTROLS.filter(c => c.status === 'documented').length,
  required: SECURITY_CONTROLS.filter(c => c.status === 'required').length,
  clientVisible: SECURITY_CONTROLS.filter(c => c.clientVisible).length,
};
