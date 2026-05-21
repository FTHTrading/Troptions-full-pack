import { XRPL_WALLET_INVENTORY_REGISTRY } from "@/content/troptions/xrplWalletInventoryRegistry";

export function listTrackedWallets() {
  return XRPL_WALLET_INVENTORY_REGISTRY;
}

export function getTrackedWallet(address: string) {
  return XRPL_WALLET_INVENTORY_REGISTRY.find((wallet) => wallet.address.toLowerCase() === address.toLowerCase());
}
