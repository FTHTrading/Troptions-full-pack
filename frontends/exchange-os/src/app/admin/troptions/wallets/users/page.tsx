import { AdminWalletShell } from "@/components/troptions-wallet/AdminWalletShell";
import { WALLET_USER_REGISTRY } from "@/content/troptions/walletUserRegistry";

export default function AdminWalletUsersPage() {
  return (
    <AdminWalletShell
      activePath="/admin/troptions/wallets/users"
      title="Wallet Users"
      subtitle="Review wallet-user identity, compliance status, and enabled modules before approving any production transition."
    >
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0D1B2A] text-xs uppercase tracking-[0.2em] text-[#C9A84C]">
            <tr>
              <th className="px-4 py-3">Handle</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">KYC / KYB</th>
              <th className="px-4 py-3">Sanctions</th>
              <th className="px-4 py-3">Wallet</th>
              <th className="px-4 py-3">Modules</th>
            </tr>
          </thead>
          <tbody>
            {WALLET_USER_REGISTRY.map((user) => (
              <tr key={user.userId} className="border-t border-slate-800 text-slate-200">
                <td className="px-4 py-4">
                  <p className="font-semibold text-white">{user.displayName}</p>
                  <p className="font-mono text-xs text-slate-500">{user.handle}</p>
                </td>
                <td className="px-4 py-4 uppercase text-slate-300">{user.role}</td>
                <td className="px-4 py-4 text-xs leading-6 text-slate-300">
                  <div>KYC: {user.kycStatus}</div>
                  <div>KYB: {user.kybStatus}</div>
                </td>
                <td className="px-4 py-4 text-xs uppercase text-slate-300">{user.sanctionsStatus}</td>
                <td className="px-4 py-4 text-xs leading-6 text-slate-300">
                  <div>Status: {user.walletStatus}</div>
                  <div>Risk: {user.riskStatus}</div>
                </td>
                <td className="px-4 py-4 text-xs leading-6 text-slate-400">{user.modulesEnabled.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AdminWalletShell>
  );
}