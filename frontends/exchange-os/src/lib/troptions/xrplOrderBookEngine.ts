import { XRPL_ORDER_BOOK_REGISTRY } from "@/content/troptions/xrplOrderBookRegistry";

export function listXrplOrderBooks() {
  return XRPL_ORDER_BOOK_REGISTRY;
}

export function getXrplOrderBook(pair?: string) {
  if (!pair) return XRPL_ORDER_BOOK_REGISTRY[0] ?? null;
  return XRPL_ORDER_BOOK_REGISTRY.find((item) => item.pair.toLowerCase() === pair.toLowerCase()) ?? null;
}