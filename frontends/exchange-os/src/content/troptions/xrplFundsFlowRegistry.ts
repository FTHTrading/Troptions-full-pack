export interface XrplFundsFlowRecord {
  readonly flowId: string;
  readonly txHash: string;
  readonly from: string;
  readonly to: string;
  readonly amount: string;
  readonly currency: string;
  readonly destinationTag?: string;
  readonly explanation: string;
}

export const XRPL_FUNDS_FLOW_REGISTRY: readonly XrplFundsFlowRecord[] = [
  {
    flowId: "flow-rdew3-to-rpp12nd-8101678",
    txHash: "989D4FD7D2E4555303F562652D7E42A1BBDCD5154CC194D396412668EB4891BF",
    from: "rDEW3swAxG4iJcBSRBdKLim33TfTciKzxX",
    to: "rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1",
    amount: "8.101678",
    currency: "XRP",
    explanation: "Inbound XRP funding to rpP12ND before the later 81.417325 XRP exchange-deposit transfer.",
  },
  {
    flowId: "flow-81-xrp-to-changenow",
    txHash: "84F7978E290E10A8F6FBFF17D04846C9E90EDC8224A40071DB70D55458A2FD47",
    from: "rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1",
    to: "rKKbNYZRqwPgZYkFWvqNUFBuscEyiFyCE",
    destinationTag: "614122458",
    amount: "81.417325",
    currency: "XRP",
    explanation:
      "Delivered to ChangeNOW-tagged deposit account. Post-deposit routing is exchange-internal and requires support lookup by destination tag.",
  },
  {
    flowId: "flow-rnaf6ki-to-rpp12nd-6872680",
    txHash: "KNOWN-RNAF6KI-TO-RPP12ND-6_872680",
    from: "rnAF6Ki5sbmPZ4dTNCVzH5iyb9ScdSqyNr",
    to: "rpP12ND2K7ZRzXZBEUnQM2i18tMGytXnW1",
    amount: "6.872680",
    currency: "XRP",
    explanation: "Inbound XRP funding movement recorded for timeline continuity.",
  },
];
