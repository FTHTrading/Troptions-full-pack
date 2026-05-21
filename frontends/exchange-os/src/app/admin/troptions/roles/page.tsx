import { ROLE_REGISTRY } from "@/content/troptions/roleRegistry";

export default function AdminRolesPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-6">
        <h1 className="text-3xl font-bold">Admin - Roles</h1>
        <div className="space-y-3">
          {ROLE_REGISTRY.map((role) => (
            <div key={role.roleId} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-[#C9A84C] text-xs font-mono">{role.roleId}</p>
              <p className="text-white font-semibold">{role.displayName}</p>
              <p className="text-slate-400 text-xs">{role.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
