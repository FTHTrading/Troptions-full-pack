export interface MainnetReadinessItem {
  id: string;
  name: string;
  critical: boolean;
  status: 'complete' | 'pending' | 'blocked' | 'required' | 'gated';
  proofRequired: string;
  envVarName?: string;
  notes: string;
}

export const MAINNET_READINESS_CHECKLIST: MainnetReadinessItem[] = [
  {
    id: 'goatx-mint',
    name: 'GoatX SPL Mint',
    critical: true,
    status: 'complete',
    proofRequired: '9VJQV99t9vaY5vpMkMW3xRyxfhirDfbJXb7ymCpjQMSv on Solscan',
    notes: 'Confirmed mainnet, authorities revoked',
  },
  {
    id: 'solscan-metadata',
    name: 'Solscan Token Metadata',
    critical: true,
    status: 'pending',
    proofRequired: 'Submit name/logo/website/socials to Solscan',
    notes: 'Free submission via Solscan token page, ~30 min',
  },
  {
    id: 'raydium-lp',
    name: 'Raydium LP Pool',
    critical: true,
    status: 'blocked',
    proofRequired: 'Pool address on Solscan',
    notes: 'Needs 5-10 SOL treasury capital (treasury decision required)',
  },
  {
    id: 'lp-locked',
    name: 'LP Token Lock',
    critical: true,
    status: 'blocked',
    proofRequired: 'Lock tx signature and lock expiry',
    notes: 'Must happen immediately after LP creation. LP without lock is a rug risk.',
  },
  {
    id: 'helius-rpc',
    name: 'Helius Mainnet RPC',
    critical: true,
    status: 'required',
    proofRequired: 'Helius account active and endpoint tested',
    envVarName: 'NEXT_PUBLIC_SOLANA_RPC_URL',
    notes: 'Add to Vercel and Cloudflare env. Free tier adequate for pilot.',
  },
  {
    id: 'metaplex-collection',
    name: 'Metaplex Collection NFT',
    critical: true,
    status: 'required',
    proofRequired: 'Collection mint address on Solscan',
    notes: 'Required for collectionVerified=true on campaign NFTs. ~30 min with Metaplex CLI.',
  },
  {
    id: 'solana-mainnet-flag',
    name: 'Solana Mainnet Flag',
    critical: true,
    status: 'gated',
    proofRequired: 'Launch committee written GO required first',
    envVarName: 'NEXT_PUBLIC_SOLANA_MAINNET_ENABLED',
    notes: 'Set to true ONLY after all other critical items complete and committee issues GO. Default is false.',
  },
  {
    id: 'legal-memo',
    name: 'Legal Memo',
    critical: true,
    status: 'required',
    proofRequired: 'Signed legal memo uploaded to command-center',
    notes: 'Howey test analysis and utility token legal review. Engage external counsel.',
  },
  {
    id: 'kyc-aml',
    name: 'KYC/AML Provider',
    critical: true,
    status: 'required',
    proofRequired: 'KYC/AML provider contract signed',
    notes: 'Required for onboarding token issuers and large clients. Research: Persona, Jumio, Sumsub.',
  },
  {
    id: 'launch-committee-go',
    name: 'Launch Committee GO',
    critical: true,
    status: 'required',
    proofRequired: 'Written launch committee approval document',
    notes: 'Final gate before any mainnet trading claim. Cannot be bypassed by engineering or product.',
  },
  {
    id: 'monitoring',
    name: 'Active Monitoring',
    critical: false,
    status: 'required',
    proofRequired: 'Sentry DSN configured + alerting tested',
    envVarName: 'NEXT_PUBLIC_SENTRY_DSN',
    notes: 'Required for Level 3+. Without monitoring, production issues are invisible.',
  },
  {
    id: 'incident-plan',
    name: 'Incident Response Plan',
    critical: false,
    status: 'pending',
    proofRequired: 'Runbook published in command-center with escalation contacts',
    notes: 'Partial runbook exists. Needs escalation contacts and on-call schedule.',
  },
];

export function canEnableMainnetTrading(checklist: MainnetReadinessItem[]): {
  allowed: boolean;
  blockers: string[];
  criticalIncomplete: string[];
} {
  const criticalBlockers = checklist
    .filter(item => item.critical && item.status !== 'complete')
    .map(item => item.name);
  return {
    allowed: criticalBlockers.length === 0,
    blockers: criticalBlockers,
    criticalIncomplete: criticalBlockers,
  };
}

export const MAINNET_READINESS_SUMMARY = {
  total: MAINNET_READINESS_CHECKLIST.length,
  complete: MAINNET_READINESS_CHECKLIST.filter(i => i.status === 'complete').length,
  critical: MAINNET_READINESS_CHECKLIST.filter(i => i.critical).length,
  criticalComplete: MAINNET_READINESS_CHECKLIST.filter(i => i.critical && i.status === 'complete').length,
};
