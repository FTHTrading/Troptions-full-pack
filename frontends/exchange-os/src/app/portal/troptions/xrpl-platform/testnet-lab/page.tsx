import { ClientPortalLayout } from "@/components/client-portal/ClientPortalLayout";
import { XrplSecurityBanner } from "@/components/xrpl-platform/XrplSecurityBanner";

export default function PortalXrplTestnetLabPage() {
  return <ClientPortalLayout title="XRPL Testnet Lab" intro="Unsigned payloads and external-signer-only lab flows."><div style={{ gridColumn: "1 / -1" }}><XrplSecurityBanner /></div></ClientPortalLayout>;
}