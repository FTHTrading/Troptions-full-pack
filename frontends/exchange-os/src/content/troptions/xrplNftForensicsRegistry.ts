export interface XrplNftForensicsRecord {
  readonly nftId: string;
  readonly action: "mint" | "burn" | "transfer" | "offer";
  readonly wallet: string;
  readonly date: string;
  readonly note: string;
}

export const XRPL_NFT_FORENSICS_REGISTRY: readonly XrplNftForensicsRecord[] = [];
