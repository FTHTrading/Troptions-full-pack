export interface GlobalRailRecord {
  railCategory:
    | "fiat-rails"
    | "stablecoin-rails"
    | "xrpl-rails"
    | "exchange-rails"
    | "custody-rails"
    | "rwa-rails"
    | "treasury-rails"
    | "fx-rails"
    | "settlement-rails";
  status: "pending" | "approved" | "blocked";
  mode: "dry-run" | "instruction-ready";
  notes: string;
}

export const GLOBAL_RAIL_REGISTRY: GlobalRailRecord[] = [
  { railCategory: "fiat-rails", status: "approved", mode: "instruction-ready", notes: "Provider adapters only; no credential storage." },
  { railCategory: "stablecoin-rails", status: "pending", mode: "dry-run", notes: "Licensing and reserve review controls apply." },
  { railCategory: "xrpl-rails", status: "approved", mode: "dry-run", notes: "Read-only and simulation mode only." },
  { railCategory: "exchange-rails", status: "pending", mode: "dry-run", notes: "Venue and legal approvals required." },
  { railCategory: "custody-rails", status: "pending", mode: "instruction-ready", notes: "Third-party custody integration only." },
  { railCategory: "rwa-rails", status: "pending", mode: "dry-run", notes: "Title, valuation, custody, and proof controls required." },
  { railCategory: "treasury-rails", status: "approved", mode: "instruction-ready", notes: "Approval package required before execution." },
  { railCategory: "fx-rails", status: "pending", mode: "dry-run", notes: "FX quotes are simulated unless approved." },
  { railCategory: "settlement-rails", status: "pending", mode: "dry-run", notes: "Counterparty verification and board approval required." },
];
