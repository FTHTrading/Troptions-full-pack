import { ENTITY_REGISTRY } from "@/content/troptions/entityRegistry";

export function getEntityRegistry() {
  return ENTITY_REGISTRY;
}

export function evaluateEntityAccess(entityId: string) {
  const entity = ENTITY_REGISTRY.find((item) => item.entityId === entityId);
  if (!entity) {
    return { allowed: false, blockedReasons: ["Entity not found"] };
  }

  const blockedReasons: string[] = [];
  if (entity.kycKybStatus !== "approved") blockedReasons.push("KYC/KYB incomplete");
  if (entity.sanctionsStatus !== "clear") blockedReasons.push("Sanctions review not clear");

  return {
    allowed: blockedReasons.length === 0,
    blockedReasons,
    entity,
  };
}
