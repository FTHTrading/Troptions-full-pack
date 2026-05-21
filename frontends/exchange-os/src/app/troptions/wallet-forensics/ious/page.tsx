import { WalletForensicsLayout } from "@/components/wallet-forensics/WalletForensicsLayout";
import { IouVsXrpExplainer } from "@/components/wallet-forensics/IouVsXrpExplainer";
import { XRPL_IOU_REGISTRY } from "@/content/troptions/xrplIouRegistry";

export default function WalletForensicsIousPage() {
  return (
    <WalletForensicsLayout title="IOU Forensics" intro="Issued-currency analysis that separates native XRP from issuer-dependent IOUs.">
      <IouVsXrpExplainer />
      <section className="wf-table-wrap">
        <table className="wf-table">
          <thead>
            <tr>
              <th>Currency</th>
              <th>Issuer</th>
              <th>Category</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {XRPL_IOU_REGISTRY.map((item) => (
              <tr key={item.currency}>
                <td>{item.currency}</td>
                <td className="wf-mono">{item.issuer}</td>
                <td>{item.category}</td>
                <td>{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </WalletForensicsLayout>
  );
}
