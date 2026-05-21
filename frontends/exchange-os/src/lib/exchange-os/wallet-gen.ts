// TROPTIONS Exchange OS — Client-side wallet generation
// All generation happens in the browser. Keys never touch any server.

export type ChainType = "xrpl" | "stellar" | "solana";

export interface GeneratedWallet {
  chain: ChainType;
  address: string;
  secret: string;
  secretLabel: string;
  secretFormat: string;
  explorerUrl: string;
  fundNote: string;
}

export const CHAIN_META: Record<ChainType, { label: string; icon: string; color: string; description: string }> = {
  xrpl: {
    label: "XRP Ledger",
    icon: "◎",
    color: "var(--xos-cyan)",
    description: "Trade TROPTIONS on the XRPL DEX. Fast, low-cost, decentralized.",
  },
  stellar: {
    label: "Stellar",
    icon: "★",
    color: "var(--xos-gold)",
    description: "Send money globally in seconds for fractions of a cent.",
  },
  solana: {
    label: "Solana",
    icon: "◆",
    color: "#9945ff",
    description: "Deploy SPL tokens and access Solana DeFi.",
  },
};

export async function generateWallet(chain: ChainType): Promise<GeneratedWallet> {
  if (chain === "xrpl") {
    const { Wallet } = await import("xrpl");
    const wallet = Wallet.generate();
    return {
      chain: "xrpl",
      address: wallet.address,
      secret: wallet.seed!,
      secretLabel: "XRPL Seed",
      secretFormat: "Family Seed — starts with 's'. Import into Xumm, XRPL Toolkit, or Crossmark.",
      explorerUrl: `https://livenet.xrpl.org/accounts/${wallet.address}`,
      fundNote:
        "Your XRP address needs a minimum 2 XRP deposit to activate. Buy XRP on any exchange and send it to this address.",
    };
  }

  if (chain === "stellar") {
    const { Keypair } = await import("@stellar/stellar-sdk");
    const kp = Keypair.random();
    return {
      chain: "stellar",
      address: kp.publicKey(),
      secret: kp.secret(),
      secretLabel: "Stellar Secret Key",
      secretFormat: "Stellar Secret — starts with 'S'. Import into Lobstr, Solar, or any Stellar wallet.",
      explorerUrl: `https://stellar.expert/explorer/public/account/${kp.publicKey()}`,
      fundNote:
        "Send any amount of XLM (Stellar Lumens) to this address to activate it. Available on Coinbase, Kraken, and most exchanges.",
    };
  }

  // Solana
  const { Keypair } = await import("@solana/web3.js");
  const kp = Keypair.generate();
  const secretArray = Array.from(kp.secretKey);
  return {
    chain: "solana",
    address: kp.publicKey.toString(),
    secret: JSON.stringify(secretArray),
    secretLabel: "Solana Keypair (JSON)",
    secretFormat:
      "64-byte JSON array. Import into Phantom via Settings → Import Private Key → paste this value.",
    explorerUrl: `https://explorer.solana.com/address/${kp.publicKey.toString()}`,
    fundNote:
      "Send SOL to this address to pay for transaction fees. SOL is available on most exchanges.",
  };
}
