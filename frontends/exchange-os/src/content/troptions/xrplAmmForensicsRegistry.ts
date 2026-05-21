export interface XrplAmmForensicsRecord {
  readonly ammId: string;
  readonly pair: string;
  readonly action: "create" | "deposit" | "withdraw" | "vote" | "trade";
  readonly wallet: string;
  readonly date: string;
  readonly note: string;
}

export const XRPL_AMM_FORENSICS_REGISTRY: readonly XrplAmmForensicsRecord[] = [];
