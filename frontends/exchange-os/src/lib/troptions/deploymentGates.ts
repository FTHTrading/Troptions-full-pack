export class DeploymentGateError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function enforceDeploymentGate(writeAction: boolean): void {
  const environment = process.env.NODE_ENV ?? "development";
  if (environment !== "production") return;

  const deploymentId = process.env.TROPTIONS_DEPLOYMENT_ID;
  if (!deploymentId || !deploymentId.trim()) {
    throw new DeploymentGateError(
      503,
      "Production deployment is missing TROPTIONS_DEPLOYMENT_ID.",
    );
  }

  const releaseChannel = (process.env.TROPTIONS_RELEASE_CHANNEL ?? "").trim().toLowerCase();
  if (!releaseChannel) {
    throw new DeploymentGateError(
      503,
      "Production deployment is missing TROPTIONS_RELEASE_CHANNEL.",
    );
  }

  const allowedChannels = new Set(["prod", "staging", "dr"]);
  if (!allowedChannels.has(releaseChannel)) {
    throw new DeploymentGateError(
      503,
      `Invalid TROPTIONS_RELEASE_CHANNEL: ${releaseChannel}`,
    );
  }

  if (!writeAction) return;

  const lockdown = process.env.TROPTIONS_DEPLOYMENT_LOCKDOWN === "1";
  if (lockdown) {
    throw new DeploymentGateError(
      503,
      "Control-plane write actions are blocked by TROPTIONS_DEPLOYMENT_LOCKDOWN.",
    );
  }

  const writesEnabled = process.env.TROPTIONS_CONTROL_PLANE_WRITES_ENABLED === "1";
  if (!writesEnabled) {
    throw new DeploymentGateError(
      503,
      "Control-plane write actions are disabled by deployment gate.",
    );
  }

  const allowNonProdWrites = process.env.TROPTIONS_ALLOW_NON_PROD_CHANNEL_WRITES === "1";
  if (releaseChannel !== "prod" && !allowNonProdWrites) {
    throw new DeploymentGateError(
      503,
      `Write actions are disabled for release channel ${releaseChannel}.`,
    );
  }
}
