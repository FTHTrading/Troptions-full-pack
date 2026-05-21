import {
  TROPTIONS_WALLET_HUB_REGISTRY,
  type TroptionsWalletBalance,
  type TroptionsWalletRecord,
} from "@/content/troptions/troptionsWalletHubRegistry";

export type TroptionsTransferStatus =
  | "DRAFT"
  | "SIMULATED"
  | "COMPLIANCE_REVIEW"
  | "APPROVAL_REQUIRED"
  | "READY_FOR_OPERATOR"
  | "SUBMITTED"
  | "SETTLED"
  | "FAILED"
  | "BLOCKED";

export type TroptionsTransferType =
  | "XRPL_IOU_PAYMENT"
  | "STELLAR_ASSET_PAYMENT"
  | "X402_CREDIT_TRANSFER"
  | "INTERNAL_LEDGER_TRANSFER"
  | "CARD_PAYMENT"
  | "MESH_PAYMENT";

export type TroptionsLedgerActivity = {
  id: string;
  timestamp: string;
  category: "INTERNAL_LEDGER" | "XRPL" | "STELLAR" | "X402";
  direction: "DEBIT" | "CREDIT";
  counterparty: string;
  assetCode: string;
  amount: string;
  note: string;
  status: "REPORTED" | "SIMULATED" | "PENDING";
};

export type TroptionsTransferIntent = {
  id: string;
  createdAt: string;
  fromWalletId: string;
  toWalletId: string;
  assetCode: string;
  amount: string;
  memo?: string;
  routeType: TroptionsTransferType;
  status: TroptionsTransferStatus;
  blockedReasons: string[];
  requiredApprovals: string[];
  complianceApproved: boolean;
  operatorConfirmed: boolean;
  legalApproved: boolean;
  isSimulation: boolean;
  liveRequested: boolean;
  simulatedDelta?: {
    fromBefore: string;
    fromAfter: string;
    toBefore: string;
    toAfter: string;
  };
};

export type TroptionsWalletHubSnapshot = {
  generatedAt: string;
  wallets: readonly TroptionsWalletRecord[];
  balances: {
    byWallet: Array<{ walletId: string; balances: TroptionsWalletBalance[] }>;
    byAsset: Array<{ assetCode: string; totalAmount: string; sources: string[] }>;
  };
  chainHealth: Array<{ rail: string; status: "HEALTHY" | "REVIEW" | "SIMULATION_ONLY"; note: string }>;
  safetyStatement: string;
};

export const TROPTIONS_WALLET_HUB_SAFETY_STATEMENT =
  "Wallet Hub is metadata and simulation-first. Live transfers are blocked by default and require legal/compliance approval, explicit operator confirmation, and runtime environment gates. Secrets are never stored or returned.";

function parseAmount(value: string): number {
  const normalized = value.replace(/,/g, "");
  const maybe = Number(normalized);
  return Number.isFinite(maybe) ? maybe : 0;
}

function formatAmount(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 8,
  });
}

function getBalanceAmount(wallet: TroptionsWalletRecord, assetCode: string): number {
  const found = wallet.assetBalances.find((b) => b.assetCode === assetCode);
  if (!found) return 0;
  return parseAmount(found.amount);
}

function hasLiveTransferFlags(): boolean {
  return (
    process.env.TROPTIONS_ENABLE_LIVE_SEND === "true" &&
    process.env.TROPTIONS_LEGAL_APPROVED === "true" &&
    process.env.TROPTIONS_OPERATOR_CONFIRMED === "true" &&
    process.env.TROPTIONS_SECURE_SIGNER_MODE === "true"
  );
}

function containsSecretLikeContent(value: string): boolean {
  return /(seed|privatekey|secretkey|mnemonic)/i.test(value);
}

export function getTroptionsWalletHubSnapshot(): TroptionsWalletHubSnapshot {
  const byWallet = TROPTIONS_WALLET_HUB_REGISTRY.map((wallet) => ({
    walletId: wallet.id,
    balances: [...wallet.assetBalances],
  }));

  const aggregateMap = new Map<string, { total: number; sources: string[] }>();
  for (const wallet of TROPTIONS_WALLET_HUB_REGISTRY) {
    for (const bal of wallet.assetBalances) {
      const existing = aggregateMap.get(bal.assetCode) ?? { total: 0, sources: [] };
      existing.total += parseAmount(bal.amount);
      if (!existing.sources.includes(wallet.id)) existing.sources.push(wallet.id);
      aggregateMap.set(bal.assetCode, existing);
    }
  }

  const byAsset = [...aggregateMap.entries()].map(([assetCode, value]) => ({
    assetCode,
    totalAmount: formatAmount(value.total),
    sources: value.sources,
  }));

  return {
    generatedAt: new Date().toISOString(),
    wallets: TROPTIONS_WALLET_HUB_REGISTRY,
    balances: {
      byWallet,
      byAsset,
    },
    chainHealth: [
      { rail: "XRPL Ledger", status: "HEALTHY", note: "Primary issuer/distribution rails are reachable and reported live." },
      { rail: "Stellar Account Rail", status: "REVIEW", note: "Mirror balances are reported; USD conversion may vary by DEX price feeds." },
      { rail: "x402 Cycles", status: "SIMULATION_ONLY", note: "Live settlement remains blocked pending approvals." },
      { rail: "L1 Anchors", status: "HEALTHY", note: "Genesis and operational anchors reported available." },
      { rail: "Agent Activity", status: "REVIEW", note: "Operator gating and legal controls enforced." },
      { rail: "Refills / 24h", status: "SIMULATION_ONLY", note: "Refills are simulation records until live control gates are enabled." },
    ],
    safetyStatement: TROPTIONS_WALLET_HUB_SAFETY_STATEMENT,
  };
}

export function getWalletById(id: string): TroptionsWalletRecord | undefined {
  return TROPTIONS_WALLET_HUB_REGISTRY.find((wallet) => wallet.id === id);
}

export function getWalletBalances(walletId: string): TroptionsWalletBalance[] {
  return getWalletById(walletId)?.assetBalances ?? [];
}

export function getRecentWalletActivity(): TroptionsLedgerActivity[] {
  return [
    {
      id: "ledger-2026-04-03-01",
      timestamp: "2026-04-03T15:20:00Z",
      category: "INTERNAL_LEDGER",
      direction: "DEBIT",
      counterparty: "FTH Operations",
      assetCode: "FTH_USD",
      amount: "100",
      note: "To FTH Operations · Apr 3 · FTH_USD · -$100",
      status: "REPORTED",
    },
    {
      id: "ledger-2026-03-30-01",
      timestamp: "2026-03-30T21:00:00Z",
      category: "INTERNAL_LEDGER",
      direction: "DEBIT",
      counterparty: "FTH Partner",
      assetCode: "FTH_USD",
      amount: "100",
      note: "To FTH Partner · Mar 30 · FTH_USD · -$100",
      status: "REPORTED",
    },
    {
      id: "ledger-2026-03-30-02",
      timestamp: "2026-03-30T20:15:00Z",
      category: "INTERNAL_LEDGER",
      direction: "DEBIT",
      counterparty: "FTH Operations",
      assetCode: "FTH_USD",
      amount: "50",
      note: "To FTH Operations · Mar 30 · FTH_USD · -$50",
      status: "REPORTED",
    },
    {
      id: "ledger-2026-03-30-03",
      timestamp: "2026-03-30T20:10:00Z",
      category: "INTERNAL_LEDGER",
      direction: "DEBIT",
      counterparty: "FTH Operations",
      assetCode: "FTH_USD",
      amount: "50",
      note: "To FTH Operations · Mar 30 · FTH_USD · -$50",
      status: "REPORTED",
    },
  ];
}

export function createTransferIntent(input: {
  fromWalletId: string;
  toWalletId: string;
  assetCode: string;
  amount: string;
  memo?: string;
  routeType: TroptionsTransferType;
  liveRequested?: boolean;
}): TroptionsTransferIntent {
  return {
    id: `txi-${Date.now()}`,
    createdAt: new Date().toISOString(),
    fromWalletId: input.fromWalletId,
    toWalletId: input.toWalletId,
    assetCode: input.assetCode,
    amount: input.amount,
    memo: input.memo,
    routeType: input.routeType,
    status: "DRAFT",
    blockedReasons: [],
    requiredApprovals: [
      "COMPLIANCE_APPROVAL",
      "LEGAL_APPROVAL",
      "OPERATOR_CONFIRMATION",
      "RUNTIME_ENV_FLAGS",
    ],
    complianceApproved: false,
    operatorConfirmed: false,
    legalApproved: false,
    isSimulation: true,
    liveRequested: Boolean(input.liveRequested),
  };
}

export function validateTransferIntent(intent: TroptionsTransferIntent): {
  ok: boolean;
  blockedReasons: string[];
  requiredApprovals: string[];
  liveAllowed: boolean;
} {
  const blockedReasons: string[] = [];
  const from = getWalletById(intent.fromWalletId);
  const to = getWalletById(intent.toWalletId);

  if (!from) blockedReasons.push("Sender wallet is missing.");
  if (!to) blockedReasons.push("Receiver wallet is missing.");

  if (containsSecretLikeContent(JSON.stringify(intent))) {
    blockedReasons.push("Secret-like payload detected; request rejected.");
  }

  const amount = parseAmount(intent.amount);
  if (amount <= 0) blockedReasons.push("Transfer amount must be greater than zero.");

  if (from) {
    const available = getBalanceAmount(from, intent.assetCode);
    if (available < amount) {
      blockedReasons.push("Insufficient asset balance in sender wallet.");
    }
  }

  if (intent.liveRequested) {
    if (!intent.complianceApproved) blockedReasons.push("Compliance approval missing.");
    if (!intent.legalApproved) blockedReasons.push("Legal approval missing.");
    if (!intent.operatorConfirmed) blockedReasons.push("Operator confirmation missing.");
    if (!hasLiveTransferFlags()) blockedReasons.push("Runtime live transfer env flags are missing.");
  }

  return {
    ok: blockedReasons.length === 0,
    blockedReasons,
    requiredApprovals: [...intent.requiredApprovals],
    liveAllowed: intent.liveRequested && blockedReasons.length === 0,
  };
}

export function simulateTransfer(intent: TroptionsTransferIntent): TroptionsTransferIntent {
  const validation = validateTransferIntent(intent);
  const from = getWalletById(intent.fromWalletId);
  const to = getWalletById(intent.toWalletId);

  if (!validation.ok || !from || !to) {
    return {
      ...intent,
      status: "BLOCKED",
      blockedReasons: validation.blockedReasons,
      isSimulation: true,
    };
  }

  const amount = parseAmount(intent.amount);
  const fromBefore = getBalanceAmount(from, intent.assetCode);
  const toBefore = getBalanceAmount(to, intent.assetCode);

  return {
    ...intent,
    status: "SIMULATED",
    isSimulation: true,
    blockedReasons: [],
    simulatedDelta: {
      fromBefore: formatAmount(fromBefore),
      fromAfter: formatAmount(fromBefore - amount),
      toBefore: formatAmount(toBefore),
      toAfter: formatAmount(toBefore + amount),
    },
  };
}

export function blockTransferIntent(
  intent: TroptionsTransferIntent,
  reason: string,
): TroptionsTransferIntent {
  return {
    ...intent,
    status: "BLOCKED",
    blockedReasons: [...intent.blockedReasons, reason],
    isSimulation: true,
  };
}

export function generateWalletReceipt(input: {
  intent: TroptionsTransferIntent;
  liveTxHash?: string;
}) {
  const { intent, liveTxHash } = input;
  return {
    receiptId: `rct-${intent.id}`,
    createdAt: new Date().toISOString(),
    transferId: intent.id,
    fromWalletId: intent.fromWalletId,
    toWalletId: intent.toWalletId,
    assetCode: intent.assetCode,
    amount: intent.amount,
    routeType: intent.routeType,
    status: intent.status,
    simulated: !liveTxHash,
    liveTxHash: liveTxHash ?? null,
    memo: intent.memo ?? null,
    safetyStatement: TROPTIONS_WALLET_HUB_SAFETY_STATEMENT,
  };
}

export function generateWalletStatement(input: {
  walletId: string;
  periodLabel?: string;
}) {
  const wallet = getWalletById(input.walletId);
  return {
    statementId: `stm-${input.walletId}-${Date.now()}`,
    walletId: input.walletId,
    periodLabel: input.periodLabel ?? "Current Snapshot",
    generatedAt: new Date().toISOString(),
    wallet: wallet ?? null,
    balances: wallet?.assetBalances ?? [],
    recentActivity: getRecentWalletActivity(),
    disclaimer:
      "Statement is snapshot-based and may include simulation/reported data. Live settlement is approval-gated.",
  };
}
