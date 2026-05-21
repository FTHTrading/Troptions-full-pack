import type { Metadata } from "next";
import Link from "next/link";
import { TROPTIONS_NAMESPACES } from "@/content/troptions-cloud/namespaceRegistry";

interface Props {
  params: Promise<{ namespace: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { namespace } = await params;
  return { title: `Team — ${namespace} — Troptions Cloud` };
}

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

const MOCK_ROLES = ["owner", "admin", "editor", "viewer", "contributor", "moderator", "support"];

export default async function TeamPage({ params }: Props) {
  const { namespace } = await params;

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <nav className="mb-4 text-[10px] uppercase tracking-[0.2em] text-gray-500">
            <Link href={`/troptions-cloud/${namespace}`} className="hover:text-white transition-colors">Dashboard</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Team</span>
          </nav>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">Troptions Cloud</p>
          <h1 className="text-2xl font-bold text-white">Team Management</h1>
          <p className="mt-2 text-sm text-gray-400">
            Manage namespace team members, roles, and access permissions.
          </p>
        </div>

        {/* Simulation Banner */}
        <div className="mb-8 rounded-xl border border-yellow-800/50 bg-yellow-900/10 p-4">
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em] mb-1">Simulation Only</p>
          <p className="text-xs text-yellow-300/80">Team management is non-functional in this phase.</p>
        </div>

        {/* Invite Member */}
        <div className="mb-8 rounded-xl border border-gray-800 bg-[#0F1923] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400 mb-4">Invite Team Member</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-gray-500">Email Address</label>
              <input
                disabled
                type="email"
                placeholder="member@example.com"
                className="cursor-not-allowed w-full rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-gray-500">Role</label>
              <select
                disabled
                className="cursor-not-allowed w-full rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2.5 text-sm text-gray-600"
              >
                {MOCK_ROLES.map((r) => (
                  <option key={r} value={r} className="capitalize">{r}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            disabled
            className="mt-4 cursor-not-allowed rounded-lg border border-gray-700 bg-[#080C14] px-4 py-2 text-xs font-semibold text-gray-600"
          >
            Send Invite — Simulation Only
          </button>
        </div>

        {/* Members table scaffold */}
        <div className="rounded-xl border border-gray-800 bg-[#0F1923] overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-400">Team Members</p>
          </div>
          <div className="divide-y divide-gray-800">
            {[
              { name: "Namespace Owner", email: "owner@troptions.com", role: "owner" },
              { name: "Team Admin", email: "admin@troptions.com", role: "admin" },
            ].map((member) => (
              <div key={member.email} className="flex items-center justify-between gap-4 px-5 py-3">
                <div>
                  <p className="text-sm text-white font-medium">{member.name}</p>
                  <p className="text-[10px] text-gray-500 font-mono">{member.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-gray-800 px-2.5 py-1 text-[10px] text-gray-400 capitalize">{member.role}</span>
                  <button
                    disabled
                    className="cursor-not-allowed text-[10px] text-gray-600 hover:text-gray-600"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
