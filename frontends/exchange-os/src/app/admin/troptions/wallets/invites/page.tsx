import { AdminWalletShell } from "@/components/troptions-wallet/AdminWalletShell";
import { WALLET_INVITE_REGISTRY } from "@/content/troptions/walletInviteRegistry";

export default function AdminWalletInvitesPage() {
  return (
    <AdminWalletShell
      activePath="/admin/troptions/wallets/invites"
      title="Wallet Invites"
      subtitle="Track who can onboard, required KYC levels, and whether any invite should be paused before wallet creation."
    >
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0D1B2A] text-xs uppercase tracking-[0.2em] text-[#C9A84C]">
            <tr>
              <th className="px-4 py-3">Invite</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">KYC Level</th>
              <th className="px-4 py-3">Usage</th>
              <th className="px-4 py-3">Modules</th>
            </tr>
          </thead>
          <tbody>
            {WALLET_INVITE_REGISTRY.map((invite) => (
              <tr key={invite.inviteId} className="border-t border-slate-800 text-slate-200">
                <td className="px-4 py-4">
                  <p className="font-semibold text-white">{invite.inviteHandle}</p>
                  <p className="font-mono text-xs text-slate-500">{invite.inviteId}</p>
                </td>
                <td className="px-4 py-4 uppercase text-slate-300">{invite.inviteStatus}</td>
                <td className="px-4 py-4 uppercase text-slate-300">{invite.requiredKycLevel}</td>
                <td className="px-4 py-4 text-slate-300">{invite.currentUses} / {invite.maxUses}</td>
                <td className="px-4 py-4 text-xs leading-6 text-slate-400">{invite.allowedWalletModules.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AdminWalletShell>
  );
}