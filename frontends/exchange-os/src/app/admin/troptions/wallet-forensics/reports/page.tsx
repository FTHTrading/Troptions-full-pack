import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { buildWalletForensicsReport, renderWalletForensicsReportHtml } from "@/lib/troptions/walletForensicsReportBuilder";

export default function AdminWalletForensicsReportsPage() {
  const report = buildWalletForensicsReport();
  const html = renderWalletForensicsReportHtml(report);

  return (
    <WalletForensicsLayout title="Admin Wallet Forensics Reports" intro="Report export surface for forensic findings, support templates, and next actions.">
      <section className="wf-panel">
        <h2>Executive summary</h2>
        <p>{report.executiveSummary}</p>
        <h3>Support template</h3>
        <pre>{report.supportTemplates[0]}</pre>
      </section>
      <section className="wf-panel">
        <h2>HTML report preview</h2>
        <pre>{html.slice(0, 4000)}{html.length > 4000 ? "\n...truncated preview..." : ""}</pre>
      </section>
    </WalletForensicsLayout>
  );
}
