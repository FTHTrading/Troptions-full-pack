import type { BatchMode, InnerTxInput } from "./prepareBatch";
import { TROPTIONS_FEE_WALLET, TROPTIONS_ISSUER } from "./walletRegistry";

export type BatchScenarioId = "01" | "02" | "03" | "04" | "05" | "06";

export type BatchScenarioMeta = {
  id: BatchScenarioId;
  label: string;
  mode: BatchMode;
  feeLabel: string;
  description: string;
};

export const BATCH_SCENARIOS: BatchScenarioMeta[] = [
  {
    id: "01",
    label: "Atomic Launch",
    mode: "ALLORNOTHING",
    feeLabel: "1.5%",
    description: "Mint + offer + trustline — all succeed or all revert.",
  },
  {
    id: "02",
    label: "Merchant Bundle",
    mode: "INDEPENDENT",
    feeLabel: "1.0%",
    description: "Trustline, deposit, NFT tiers, platform fee — failures do not block others.",
  },
  {
    id: "03",
    label: "Trustless Swap",
    mode: "ALLORNOTHING",
    feeLabel: "0.75%",
    description: "Multi-party atomic swap plan — both sign batch hash.",
  },
  {
    id: "04",
    label: "Slippage Auction",
    mode: "ONLYONE",
    feeLabel: "0.5%",
    description: "Ladder of offers — first fill wins, rest cancelled.",
  },
  {
    id: "05",
    label: "Dividend Payroll",
    mode: "UNTILFAILURE",
    feeLabel: "0.25%",
    description: "Sequential owner payments until first failure.",
  },
  {
    id: "06",
    label: "White-Label SDK",
    mode: "ALLORNOTHING",
    feeLabel: "1.5%",
    description: "Partner-branded batch wrapper — enterprise agreement required.",
  },
];

export function buildScenarioInnerTxs(
  scenario: BatchScenarioId,
  account: string,
  params: { destinations?: string[]; amountDrops?: string } = {}
): InnerTxInput[] {
  const amt = params.amountDrops ?? "1000000";
  const dests = params.destinations?.length
    ? params.destinations
    : [account];

  switch (scenario) {
    case "01":
      return [
        {
          TransactionType: "Payment",
          Account: account,
          Destination: account,
          Amount: amt,
          Memos: [{ Memo: { MemoData: "61746f6d69632d6c61756e63682d64656d6f" } }],
        },
      ];
    case "02":
      return [
        { TransactionType: "Payment", Account: account, Destination: TROPTIONS_FEE_WALLET, Amount: "50000000" },
        { TransactionType: "Payment", Account: account, Destination: account, Amount: amt },
      ];
    case "03":
      return [
        { TransactionType: "Payment", Account: account, Destination: dests[0] ?? account, Amount: amt },
      ];
    case "04":
      return ["450000", "460000", "470000", "480000"].map((price) => ({
        TransactionType: "OfferCreate",
        Account: account,
        TakerGets: amt,
        TakerPays: { currency: "54524F5054494F4E530000000000000000000000", issuer: TROPTIONS_ISSUER, value: price },
      }));
    case "05":
      return dests.slice(0, 7).map((d) => ({
        TransactionType: "Payment",
        Account: account,
        Destination: d,
        Amount: amt,
      }));
    case "06":
    default:
      return [{ TransactionType: "Payment", Account: account, Destination: account, Amount: amt }];
  }
}
