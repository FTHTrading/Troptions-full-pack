import { readFileSync } from "node:fs";
import path from "node:path";
import { XRPL_DEPENDENCY_SECURITY_REGISTRY } from "@/content/troptions/xrplDependencySecurityRegistry";

export interface XrplDependencySecurityResult {
  readonly packageName: string;
  readonly installed: boolean;
  readonly installedVersion: string | null;
  readonly safe: boolean;
  readonly blockedReason?: string;
}

function packageJsonPath() {
  return path.join(process.cwd(), "package.json");
}

function packageLockPath() {
  return path.join(process.cwd(), "package-lock.json");
}

function readJsonFile(filePath: string): unknown {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function getInstalledXrplVersion(): string | null {
  try {
    const packageJson = readJsonFile(packageJsonPath()) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const declaredVersion = packageJson.dependencies?.xrpl || packageJson.devDependencies?.xrpl;
    if (declaredVersion) {
      return declaredVersion.replace(/^[^\d]*/, "");
    }
  } catch {
    return null;
  }

  return null;
}

export function inspectXrplDependencySecurity(): readonly XrplDependencySecurityResult[] {
  const lockVersion = (() => {
    try {
      const lock = readJsonFile(packageLockPath()) as {
        packages?: Record<string, { version?: string }>;
      };
      return lock.packages?.["node_modules/xrpl"]?.version ?? null;
    } catch {
      return null;
    }
  })();

  const declaredVersion = getInstalledXrplVersion();

  return XRPL_DEPENDENCY_SECURITY_REGISTRY.map((entry) => {
    const installedVersion = lockVersion || declaredVersion;
    const isCompromised = Boolean(installedVersion && entry.compromisedVersions.includes(installedVersion));

    return {
      packageName: entry.packageName,
      installed: Boolean(installedVersion),
      installedVersion,
      safe: !isCompromised,
      blockedReason: isCompromised ? `Blocked compromised xrpl.js version ${installedVersion}. Upgrade required.` : undefined,
    };
  });
}

export function assertSafeXrplDependencyVersion() {
  const findings = inspectXrplDependencySecurity();
  const blocked = findings.find((item) => !item.safe);
  if (blocked?.blockedReason) {
    throw new Error(blocked.blockedReason);
  }
  return findings;
}