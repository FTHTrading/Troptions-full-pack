import { ROLE_PERMISSIONS } from "@/content/troptions/permissionRegistry";

export default function AdminPermissionsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-6">
        <h1 className="text-3xl font-bold">Admin - Permissions</h1>

        <div className="space-y-3">
          {Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => (
            <div key={role} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-[#C9A84C] text-xs font-mono">{role}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {permissions.map((permission) => (
                  <span key={permission} className="text-xs bg-slate-800 border border-slate-700 rounded px-2 py-0.5">{permission}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
