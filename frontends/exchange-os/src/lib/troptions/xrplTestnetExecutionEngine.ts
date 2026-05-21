import { getXrplExternalSignerGate } from "@/lib/troptions/xrplExternalSignerGate";

interface UnsignedTransactionInput {
  readonly account: string;
  readonly takerGets?: string;
  readonly takerPays?: string;
  readonly destination?: string;
  readonly amount?: string;
}

function assertNoSensitiveSigningMaterial(payload: Record<string, unknown>) {
  const bannedKeys = ["privateKey", "seed", "familySeed", "mnemonic"];
  const found = bannedKeys.find((key) => Object.prototype.hasOwnProperty.call(payload, key));
  if (found) {
    throw new Error(`Sensitive signing material is not accepted: ${found}`);
  }
}

export function createUnsignedTestnetOffer(input: UnsignedTransactionInput) {
  assertNoSensitiveSigningMaterial(input as unknown as Record<string, unknown>);

  return {
    mode: "testnet-unsigned-offer",
    network: "testnet",
    isLiveMainnetExecutionEnabled: false,
    signer: getXrplExternalSignerGate(),
    txJson: {
      TransactionType: "OfferCreate",
      Account: input.account,
      TakerGets: input.takerGets ?? "1000000",
      TakerPays: input.takerPays ?? "1200000",
      Flags: 0,
    },
    blockedReason: "Unsigned payload only. Submit through an external signer in testnet workflows.",
    requiredApprovals: ["Operator auth", "Audit trail", "External signer"],
    auditHint: "Unsigned testnet payload only. No transaction submission performed.",
  } as const;
}

export function createUnsignedTestnetPayment(input: UnsignedTransactionInput) {
  assertNoSensitiveSigningMaterial(input as unknown as Record<string, unknown>);

  return {
    mode: "testnet-unsigned-payment",
    network: "testnet",
    isLiveMainnetExecutionEnabled: false,
    signer: getXrplExternalSignerGate(),
    txJson: {
      TransactionType: "Payment",
      Account: input.account,
      Destination: input.destination ?? "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
      Amount: input.amount ?? "1000000",
    },
    blockedReason: "Unsigned payload only. Submit through an external signer in testnet workflows.",
    requiredApprovals: ["Operator auth", "Audit trail", "External signer"],
    auditHint: "Unsigned testnet payload only. No transaction submission performed.",
  } as const;
}