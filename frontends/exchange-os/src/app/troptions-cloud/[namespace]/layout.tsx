import type { ReactNode } from "react";
import Link from "next/link";
import { TROPTIONS_NAMESPACES, getNamespace } from "@/content/troptions-cloud/namespaceRegistry";
import TroptionsNamespaceSwitcher from "@/components/troptions-cloud/TroptionsNamespaceSwitcher";

interface NamespaceLayoutProps {
  children: ReactNode;
  params: Promise<{ namespace: string }>;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "" },
  { label: "Membership", href: "/membership" },
  { label: "AI Studio", href: "/ai" },
  { label: "AI Systems", href: "/ai/systems" },
  { label: "Sovereign AI", href: "/sovereign-ai" },
  { label: "Knowledge Vault", href: "/knowledge-vault" },
  { label: "Model Router", href: "/model-router" },
  { label: "AI Policy", href: "/ai-policy" },
  { label: "Media Studio", href: "/media" },
  { label: "Business Workspace", href: "/business" },
  { label: "Healthcare Workspace", href: "/healthcare" },
  { label: "Proof Vault", href: "/proof" },
  { label: "Web3 Identity", href: "/web3" },
  { label: "Team", href: "/team" },
  { label: "Audit Log", href: "/audit" },
  { label: "Settings", href: "/settings" },
];

export async function generateStaticParams() {
  return TROPTIONS_NAMESPACES.map((n) => ({ namespace: n.slug }));
}

export default async function NamespaceLayout({ children, params }: NamespaceLayoutProps) {
  const { namespace } = await params;
  const ns = getNamespace(namespace);

  return (
    <div className="min-h-screen bg-[#080C14] text-white flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-gray-800 bg-[#0F1923] px-4 py-6">
        {/* Brand */}
        <Link href="/troptions-cloud" className="mb-6 block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#C9A84C]">Troptions Cloud</p>
        </Link>

        {/* Namespace Switcher */}
        <div className="mb-6">
          <TroptionsNamespaceSwitcher
            currentSlug={namespace}
            namespaces={TROPTIONS_NAMESPACES}
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const href = `/troptions-cloud/${namespace}${item.href}`;
            return (
              <Link
                key={item.label}
                href={href}
                className="flex items-center rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-[#080C14] hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Simulation flag */}
        <div className="mt-6 rounded-lg border border-yellow-800/40 bg-yellow-900/10 px-3 py-2">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-yellow-500">Simulation Only</p>
        </div>

        {/* Namespace name / plan at bottom */}
        {ns && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-[10px] text-gray-600 font-mono truncate">{ns.slug}</p>
            <p className="text-[10px] text-gray-600 capitalize">{ns.type} · {ns.plan}</p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between border-b border-gray-800 bg-[#0F1923] px-4 py-3">
          <Link href="/troptions-cloud">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">Troptions Cloud</p>
          </Link>
          <p className="text-xs text-gray-400 font-mono">{namespace}</p>
        </div>

        {children}
      </main>
    </div>
  );
}
