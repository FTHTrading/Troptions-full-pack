export interface XrplDependencySecurityEntry {
  readonly id: string;
  readonly packageName: string;
  readonly compromisedVersions: readonly string[];
  readonly policy: string;
  readonly remediation: string;
}

export const XRPL_DEPENDENCY_SECURITY_REGISTRY: readonly XrplDependencySecurityEntry[] = [
  {
    id: "xrpl-js-compromise-apr-2025",
    packageName: "xrpl",
    compromisedVersions: ["4.2.1", "4.2.2", "4.2.3", "4.2.4", "2.14.2"],
    policy: "Block compromised xrpl.js versions and require upgrade or adapter-only mode.",
    remediation: "Upgrade to a patched version before enabling any SDK-backed XRPL integration.",
  },
];