// TROPTIONS Exchange OS — Proof Packet Types

export interface ProofPacket {
  id: string;
  generatedAt: string;
  token: {
    name: string;
    ticker: string;
    issuer: string;
    metadataUrl?: string;
  };
  network: {
    name: string;
    websocket: string;
    mainnetEnabled: boolean;
    explorerBase: string;
  };
  trustlineRequired: boolean;
  ammPool?: { account: string };
  x402Services: string[];
  rewardPolicy: Record<string, unknown>;
  feePolicy: Record<string, unknown>;
  riskLabels: string[];
  demoMode: boolean;
  productionVerified: boolean;
  attestation: string;
}

export interface ProofPacketInput {
  tokenName: string;
  tokenTicker: string;
  issuerAddress: string;
  metadataUrl?: string;
  trustlineRequired?: boolean;
  ammPoolAccount?: string;
  x402ServiceIds?: string[];
  rewardPolicy?: Record<string, unknown>;
  feePolicy?: Record<string, unknown>;
  riskLabelIds?: string[];
}
