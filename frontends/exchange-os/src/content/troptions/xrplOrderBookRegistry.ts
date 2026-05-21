export interface XrplOrderBookLevel {
  readonly price: string;
  readonly amount: string;
}

export interface XrplOrderBookRecord {
  readonly id: string;
  readonly pair: string;
  readonly method: "book_offers";
  readonly bids: readonly XrplOrderBookLevel[];
  readonly asks: readonly XrplOrderBookLevel[];
  readonly status: "read-only" | "simulated";
}

export const XRPL_ORDER_BOOK_REGISTRY: readonly XrplOrderBookRecord[] = [
  {
    id: "ob-troptions",
    pair: "XRP / TROPTIONS",
    method: "book_offers",
    bids: [
      { price: "0.0024", amount: "8400000" },
      { price: "0.0023", amount: "5200000" },
      { price: "0.0022", amount: "3100000" },
    ],
    asks: [
      { price: "0.0025", amount: "6700000" },
      { price: "0.0026", amount: "9100000" },
      { price: "0.0027", amount: "4500000" },
    ],
    status: "simulated",
  },
  {
    id: "ob-1",
    pair: "XRP / LEGACY-TOKEN",
    method: "book_offers",
    bids: [
      { price: "0.8412", amount: "120000" },
      { price: "0.8405", amount: "86000" },
      { price: "0.8390", amount: "44000" },
    ],
    asks: [
      { price: "0.8431", amount: "91000" },
      { price: "0.8440", amount: "135000" },
      { price: "0.8454", amount: "56000" },
    ],
    status: "simulated",
  },
  {
    id: "ob-2",
    pair: "XRP / SOVBND",
    method: "book_offers",
    bids: [
      { price: "0.1157", amount: "330000" },
      { price: "0.1152", amount: "210000" },
    ],
    asks: [
      { price: "0.1168", amount: "190000" },
      { price: "0.1174", amount: "250000" },
    ],
    status: "simulated",
  },
];