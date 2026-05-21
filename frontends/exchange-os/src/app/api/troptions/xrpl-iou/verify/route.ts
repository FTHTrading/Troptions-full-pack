import { NextResponse } from "next/server";
import {
  XRPL_IOU_ASSET_CONFIGS,
  XRPL_ISSUER_ADDRESS,
  XRPL_DISTRIBUTOR_ADDRESS,
} from "@/lib/troptions/xrplIouIssuanceEngine";
import {
  XRPL_IOU_REGISTRY,
  TROPTIONS_STELLAR_ISSUER,
} from "@/content/troptions/xrplIouRegistry";
import { XRPL_ISSUED_ASSET_REGISTRY } from "@/content/troptions/xrplIssuedAssetRegistry";

/**
 * GET /api/troptions/xrpl-iou/verify
 *
 * Returns the IOU verification and validation status for all registered
 * TROPTIONS Gateway assets. Read-only, simulation-aware.
 * No live blockchain queries. Returns registry-based verification data.
 */
export async function GET() {
  const issuedAssets = XRPL_ISSUED_ASSET_REGISTRY.filter(
    (a) => a.onChainStatus === "issued"
  );

  const allAssets = XRPL_ISSUED_ASSET_REGISTRY.map((asset) => {
    const engineConfig = XRPL_IOU_ASSET_CONFIGS.find(
      (c) => c.xrplCurrencyCode === asset.symbol || c.assetType === asset.symbol
    );
    const iouRecord = XRPL_IOU_REGISTRY.find((r) => r.currency === asset.symbol);

    return {
      id: asset.id,
      symbol: asset.symbol,
      displayName: asset.displayName,
      assetType: asset.assetType,
      issuerAddress: asset.issuerAddress ?? XRPL_ISSUER_ADDRESS,
      onChainStatus: asset.onChainStatus,
      supply: asset.supply ?? null,
      rwaDescription: asset.rwaDescription,
      logoPath: asset.logoPath ?? null,
      verification: {
        issuerLinked: !!asset.issuerAddress,
        registryEntry: !!iouRecord,
        engineEntry: !!engineConfig,
        freezeEnabled: asset.freezeEnabled,
        trustlineRequired: asset.trustlineRequired,
        mainnetIssuedAt: engineConfig?.mainnetIssuedAt ?? null,
      },
    };
  });

  const summary = {
    totalRegistered: allAssets.length,
    issuedOnChain: issuedAssets.length,
    pendingIssuance: allAssets.filter((a) => a.onChainStatus === "pending").length,
    draft: allAssets.filter((a) => a.onChainStatus === "draft").length,
  };

  return NextResponse.json({
    simulationOnly: true,
    disclaimer:
      "All on-chain status values are registry-based. No live blockchain query is performed. Verify via XRPSCAN or XRPL Explorer for authoritative on-chain data.",
    gateway: {
      xrplIssuer: XRPL_ISSUER_ADDRESS,
      xrplDistributor: XRPL_DISTRIBUTOR_ADDRESS,
      stellarIssuer: TROPTIONS_STELLAR_ISSUER,
      explorerLinks: {
        xrplIssuer: `https://xrpscan.com/account/${XRPL_ISSUER_ADDRESS}`,
        xrplDistributor: `https://xrpscan.com/account/${XRPL_DISTRIBUTOR_ADDRESS}`,
        stellarIssuer: `https://stellar.expert/explorer/public/account/${TROPTIONS_STELLAR_ISSUER}`,
      },
    },
    summary,
    assets: allAssets,
  });
}
