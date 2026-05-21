// TROPTIONS / UNYKORN — Public Claim Rules
// These rules govern what can be stated publicly about the ecosystem.
// Never claim tradable/liquid/verified without meeting ALL conditions below.

export interface ClaimRule {
  claim: string;
  allowedWhen: string;
  currentlyAllowed: boolean;
  blocker: string | null;
  proofLink?: string;
}

export const EXCHANGE_OS_PUBLIC_CLAIM_RULES: ClaimRule[] = [
  {
    claim: 'tradable',
    allowedWhen: 'Raydium pool exists + Jupiter route confirmed',
    currentlyAllowed: false,
    blocker: 'Raydium LP not yet created',
  },
  {
    claim: 'liquid',
    allowedWhen: 'Pool depth > minimum threshold',
    currentlyAllowed: false,
    blocker: 'No DEX pool',
  },
  {
    claim: 'verified',
    allowedWhen: 'Proof packet complete with on-chain evidence',
    currentlyAllowed: false,
    blocker: 'Proof packet generation gated',
  },
  {
    claim: 'indexed on Jupiter',
    allowedWhen: 'Jupiter shows route for token',
    currentlyAllowed: false,
    blocker: 'Depends on Raydium LP first',
  },
  {
    claim: 'chart available',
    allowedWhen: 'Birdeye/DexScreener page live',
    currentlyAllowed: false,
    blocker: 'No DEX pool — no chart',
  },
  {
    claim: 'GoatX mainnet',
    allowedWhen: 'SPL token confirmed on Solana mainnet with revoked authorities',
    currentlyAllowed: true,
    blocker: null,
    proofLink: 'https://solscan.io/token/9VJQV99t9vaY5vpMkMW3xRyxfhirDfbJXb7ymCpjQMSv',
  },
  {
    claim: 'Exchange OS pilot ready',
    allowedWhen: 'All control-layer routes live and truth-labeled',
    currentlyAllowed: true,
    blocker: null,
  },
  {
    claim: 'image generation live',
    allowedWhen: 'CF Workers AI flux-1-schnell confirmed working',
    currentlyAllowed: true,
    blocker: null,
  },
];
