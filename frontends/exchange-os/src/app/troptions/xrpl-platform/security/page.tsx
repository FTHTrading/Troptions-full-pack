import { XrplPlatformLayout } from "@/components/xrpl-platform/XrplPlatformLayout";
import { XrplSecurityBanner } from "@/components/xrpl-platform/XrplSecurityBanner";
import { inspectXrplDependencySecurity } from "@/lib/troptions/xrplDependencySecurityGuard";

export default function TroptionsXrplSecurityPage() {
  const findings = inspectXrplDependencySecurity();

  return (
    <XrplPlatformLayout title="XRPL Security and Dependency Controls" intro="Supply-chain verification, key-handling bans, and default blocks for unsafe execution paths.">
      <XrplSecurityBanner />
      <section className="xp-tableWrap">
        <table className="xp-table">
          <thead>
            <tr><th>Package</th><th>Installed</th><th>Version</th><th>Status</th></tr>
          </thead>
          <tbody>
            {findings.map((item) => (
              <tr key={item.packageName}>
                <td>{item.packageName}</td>
                <td>{item.installed ? "yes" : "no"}</td>
                <td>{item.installedVersion ?? "n/a"}</td>
                <td><span className={`xp-badge ${item.safe ? "xp-badge-safe" : "xp-badge-unsafe"}`}>{item.safe ? "safe" : "blocked"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </XrplPlatformLayout>
  );
}