// Core brand namespaces — reserved and should be minted as permanent on-chain records
// These are the first mints on mainnet launch and cannot be claimed by external parties
// Protected at the API layer (save route) and the client layer (sanitizeNamespace)

export const LOCKED_BRAND_NAMESPACES = [
  // Core platform brands
  { namespace: 'troptions',        brand: 'TROPTIONS',        description: 'Core TROPTIONS operating layer namespace' },
  { namespace: 'donk',             brand: 'DONK AI',          description: 'DONK AI campaign builder namespace' },
  { namespace: 'donk-ai',          brand: 'DONK AI',          description: 'DONK AI alternate namespace' },
  { namespace: 'unykorn',          brand: 'UNYKORN',          description: 'UNYKORN namespace and proof infrastructure' },
  { namespace: 'whichway',         brand: 'WhichWay.live',    description: 'WhichWay.live / WWAI guest OS namespace' },
  { namespace: 'wwai',             brand: 'WhichWay.live',    description: 'WWAI alternate namespace' },
  { namespace: 'fth',              brand: 'FTH',              description: 'FTH Trading namespace' },
  { namespace: 'fthx',             brand: 'FTHX',             description: 'FTHX platform namespace' },
  { namespace: 'apostle',          brand: 'Apostle Chain',    description: 'Apostle Chain ATP settlement namespace' },
  { namespace: 'apostle-chain',    brand: 'Apostle Chain',    description: 'Apostle Chain alternate namespace' },
  { namespace: 'jefe',             brand: 'JEFE',             description: 'JEFE x402 gateway namespace' },
  { namespace: 'needai',           brand: 'NeedAI',           description: 'NeedAI platform namespace' },
  { namespace: 'need-ai',          brand: 'NeedAI',           description: 'NeedAI alternate namespace' },
  { namespace: 'sovereign',        brand: 'Sovereign AI',     description: 'Sovereign AI system namespace' },
  // FIFA / World Cup 2026 event namespaces
  { namespace: 'troptions-wc2026', brand: 'TROPTIONS WC2026', description: 'World Cup 2026 TROPTIONS namespace' },
  { namespace: 'donk-wc2026',      brand: 'DONK WC2026',     description: 'DONK WC2026 campaign namespace' },
  { namespace: 'atlanta-2026',     brand: 'Atlanta 2026',     description: 'Atlanta WC2026 fan namespace' },
  // Token namespaces
  { namespace: 'kenny',            brand: 'KENNY',            description: 'KENNY token namespace (Polygon)' },
  { namespace: 'evl',              brand: 'EVL',              description: 'EVL token namespace' },
  { namespace: 'usdf',             brand: 'USDF',             description: 'USDF stablecoin namespace' },
  { namespace: 'atp',              brand: 'ATP',              description: 'Apostle Chain ATP settlement token namespace' },
] as const;

export type LockedNamespaceTuple = typeof LOCKED_BRAND_NAMESPACES[number];
export type LockedNamespace = LockedNamespaceTuple['namespace'];

export function isLockedNamespace(ns: string): boolean {
  return LOCKED_BRAND_NAMESPACES.some((b) => b.namespace === ns);
}

export function getLockedNamespaceInfo(ns: string): LockedNamespaceTuple | undefined {
  return LOCKED_BRAND_NAMESPACES.find((b) => b.namespace === ns);
}

export const LOCKED_NAMESPACE_SLUGS = LOCKED_BRAND_NAMESPACES.map((b) => b.namespace);
