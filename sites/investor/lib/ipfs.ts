/** Public IPFS gateway for anthem permanence links (content-addressed CIDs). */
export const IPFS_GATEWAY = "https://ipfs.io/ipfs";

export function ipfsUrl(cid: string): string {
  return `${IPFS_GATEWAY}/${cid}`;
}
