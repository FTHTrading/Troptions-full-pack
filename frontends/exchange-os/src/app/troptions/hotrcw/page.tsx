import Link from "next/link";

export const metadata = {
  title: "HOTRCW | TROPTIONS",
  description: "HOTRCW vertical within the TROPTIONS institutional ecosystem.",
};

export default function HotrcwPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm uppercase tracking-widest text-blue-400 mb-4">
          TROPTIONS Vertical · Est. 2003
        </p>
        <h1 className="text-4xl font-serif mb-6">HOTRCW</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          This property is part of the unified TROPTIONS ecosystem. Content and
          merchant programs for HOTRCW are being consolidated under the
          institutional operating system with proof-first launch controls.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/troptions"
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium"
          >
            TROPTIONS Home
          </Link>
          <Link
            href="/exchange-os"
            className="px-5 py-2.5 rounded-lg border border-slate-600 hover:border-blue-500 text-sm"
          >
            Exchange OS
          </Link>
          <a
            href="https://launch.unykorn.org"
            className="px-5 py-2.5 rounded-lg border border-slate-600 hover:border-blue-500 text-sm"
          >
            Token Launcher
          </a>
        </div>
        <p className="mt-12 text-xs text-slate-500">
          Domain: hotrcw.com → canonical route /troptions/hotrcw. Configure DNS
          CNAME to the troptions deployment when ready.
        </p>
      </div>
    </main>
  );
}
