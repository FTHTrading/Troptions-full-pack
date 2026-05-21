// Campaign asset minting service
// TODO: Wire actual Metaplex/Token Metadata program calls when Umi or @metaplex-foundation/mpl-token-metadata is added.
// Currently: server-side skeleton + client-safe typed interface.
// No private keys handled. No seed phrases. Non-custodial only.

import type { CampaignNFTMetadata } from './campaignTypes';

export interface MintCampaignResult {
  success: boolean;
  network: 'devnet' | 'mainnet-beta';
  txSignature?: string;
  mintAddress?: string;
  metadataUri?: string;
  error?: string;
  stub: boolean; // always true until full Metaplex integration
}

/**
 * Prepare campaign mint payload — server-safe, no private keys.
 * Call from API route only. Client passes metadata + treasury address.
 */
export async function prepareCampaignMint(params: {
  metadata: CampaignNFTMetadata;
  payerAddress: string; // user's connected wallet — no key
  network: 'devnet' | 'mainnet-beta';
}): Promise<{ metadataUri: string; readyToMint: boolean; stub: boolean }> {
  // TODO: Upload metadata to Arweave / NFT.storage / IPFS
  // For now, return a stub URI so the UI can render preview
  const stubUri = `https://launch.unykorn.org/api/solana/campaign/metadata?name=${encodeURIComponent(params.metadata.name)}`;
  return {
    metadataUri: stubUri,
    readyToMint: false, // set to true when upload + program call are wired
    stub: true,
  };
}

/**
 * Client-side: signal mint intent to API — API handles transaction construction.
 * Client signs only. No raw private key ever passes through.
 */
export async function requestMintTransaction(params: {
  metadataUri: string;
  payerAddress: string;
  quantity: number;
  network: 'devnet' | 'mainnet-beta';
}): Promise<MintCampaignResult> {
  // TODO: Call /api/solana/campaign/mint which returns a partially-signed transaction
  // Client receives base64 tx, signs with wallet adapter, sends back
  return {
    success: false,
    network: params.network,
    stub: true,
    error: 'Full mint transaction wiring pending. Run on devnet after Metaplex integration.',
  };
}
