interface NarrationScript {
  pageId: string;
  title: string;
  segments: {
    id: string;
    text: string;
    duration?: number;
  }[];
}

export const TROPTIONS_NARRATION_SCRIPTS: Record<string, NarrationScript> = {
  "capabilities-expansion": {
    pageId: "capabilities-expansion",
    title: "Troptions Capability Expansion",
    segments: [
      {
        id: "intro",
        text: "Welcome to Troptions. This is the story of institutional finance reimagined. Troptions is building the future of asset tokenization, cross-chain settlement, and public-benefit transparency. What you're about to see represents the most comprehensive institutional capability stack ever assembled in a single platform.",
      },
      {
        id: "multichain",
        text: "At the foundation is our multi-chain architecture. Solana provides high-throughput payment simulation. TRON enables USDT route monitoring. XRPL opens AMM and DEX analysis. And EVM with T-REX permissions supports permissioned tokenized assets. Everything stays simulation-first and compliance-gated.",
      },
      {
        id: "stablecoins",
        text: "We've built the stablecoin rail system from first principles. USDC is our primary institutional route for payments and settlement readiness. USDT is monitored for liquidity evaluation. Paxos rails span PYUSD, USDP, and PAXG for gold-linked reference assets. No live transfers. No guaranteed outcomes. Just readiness.",
      },
      {
        id: "rwa",
        text: "Real-world asset tokenization is ready for evaluation. We support multi-chain readiness across Solana, XRPL, and EVM. T-REX permissions ensure that investors meet eligibility and identity gates before any transfer. This is how institutional assets move in the digital age.",
      },
      {
        id: "public-benefit",
        text: "Troptions powers public-benefit transparency. We support fentanyl prevention networks by making funding more transparent, routing support to verified organizations, screening wallet risk, and producing audit-ready impact reports. Prevention-focused. Compliance-gated. Transparent.",
      },
      {
        id: "anti-illicit",
        text: "Anti-illicit-finance controls are embedded at every layer. Wallet risk simulation. Sanctions screening placeholders. Suspicious route flagging. Freeze awareness. Compliance escalation. We don't execute on suspected illicit flows. We flag them and escalate.",
      },
      {
        id: "impact",
        text: "Impact reporting is built into the system. Donations are tracked with source metadata. Grants are simulated with verification gates. And impact transparency reports are generated for public review. This is how institutional capital becomes measurable social impact.",
      },
      {
        id: "simulation",
        text: "Everything you see is simulation-only. Blocked-by-default approval gates. No live transfers. No custody movement. No chain execution. This is the platform in readiness mode, ready for institutional operators to take the next steps when the time is right.",
      },
      {
        id: "closing",
        text: "Troptions is the institutional operating system for the digital asset era. Multi-chain. Compliant. Transparent. And built from first principles for the future of finance. This is Troptions.",
      },
    ],
  },
  "homepage": {
    pageId: "homepage",
    title: "Troptions Home",
    segments: [
      {
        id: "hero",
        text: "Troptions is the institutional operating system for digital asset infrastructure. We build the foundation for real-world asset tokenization, cross-chain settlement, and public-benefit transparency.",
      },
      {
        id: "vision",
        text: "Our vision is clear: institutional capital moves faster, farther, and more transparently when built on the right infrastructure. Troptions provides that infrastructure. From proof-of-funds to settlement readiness to impact reporting.",
      },
      {
        id: "governance",
        text: "Everything is governed by approval gates, simulation-first design, and compliance-by-default controls. We don't rush to production. We build readiness, validate thoroughly, and move only when the institutional ecosystem is ready.",
      },
    ],
  },
};

export function getNarrationScript(pageId: string): NarrationScript | null {
  return TROPTIONS_NARRATION_SCRIPTS[pageId] || null;
}

export function getAllNarrationScripts(): NarrationScript[] {
  return Object.values(TROPTIONS_NARRATION_SCRIPTS);
}
