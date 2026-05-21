import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "Team — TROPTIONS Sports Network",
  description:
    "The sports media, event commerce, broadcast, and Solana infrastructure team behind TROPTIONS Sports Network. Built for FIFA-scale event activations.",
};

// ── types ──────────────────────────────────────────────────────────────────

interface Role {
  title: string;
  status: "active" | "needed" | "advisor";
  responsibility: string;
  importance: string;
}

interface Group {
  id: string;
  label: string;
  description: string;
  roles: Role[];
}

interface OperatingLayer {
  id: string;
  label: string;
  description: string;
  accent: string;
}

interface TeamData {
  operating_model: OperatingLayer[];
  groups: Group[];
}

function getTeamData(): TeamData {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "src/data/sports/team.json"),
    "utf-8",
  );
  return JSON.parse(raw) as TeamData;
}

// ── style maps ─────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  active: {
    label: "Active",
    bar: "bg-green-400",
    badge: "text-green-400 bg-green-400/10 border border-green-400/30",
  },
  needed: {
    label: "Role Open",
    bar: "bg-amber-400",
    badge: "text-amber-400 bg-amber-400/10 border border-amber-400/30",
  },
  advisor: {
    label: "Advisory Seat",
    bar: "bg-blue-400",
    badge: "text-blue-400 bg-blue-400/10 border border-blue-400/30",
  },
} satisfies Record<Role["status"], { label: string; bar: string; badge: string }>;

const LAYER_ACCENT: Record<string, string> = {
  gold: "border-[#c99a3c]/50 hover:border-[#c99a3c]",
  blue: "border-blue-400/40 hover:border-blue-400",
  amber: "border-amber-400/40 hover:border-amber-400",
  green: "border-green-400/40 hover:border-green-400",
  purple: "border-purple-400/40 hover:border-purple-400",
  rose: "border-rose-400/40 hover:border-rose-400",
};

const LAYER_LABEL: Record<string, string> = {
  gold: "text-[#c99a3c]",
  blue: "text-blue-400",
  amber: "text-amber-400",
  green: "text-green-400",
  purple: "text-purple-400",
  rose: "text-rose-400",
};

const LAYER_DOT: Record<string, string> = {
  gold: "bg-[#c99a3c]",
  blue: "bg-blue-400",
  amber: "bg-amber-400",
  green: "bg-green-400",
  purple: "bg-purple-400",
  rose: "bg-rose-400",
};


// ── sub-components (inline) ────────────────────────────────────────────────

function RoleCard({ role, groupId }: { role: Role; groupId: string }) {
  const cfg = STATUS_CONFIG[role.status];
  const barColor =
    groupId === "leadership"
      ? "bg-[#c99a3c]"
      : groupId === "event-ops"
        ? "bg-amber-400"
        : groupId === "media"
          ? "bg-blue-400"
          : groupId === "technology"
            ? "bg-purple-400"
            : "bg-white/20";

  return (
    <div className="border border-white/10 bg-[#0b1f36] flex flex-col overflow-hidden group hover:border-white/25 transition-colors duration-200">
      <div className={`h-[3px] w-full ${role.status === "active" ? "bg-green-400" : role.status === "needed" ? barColor : "bg-blue-400/50"}`} />
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-white font-semibold text-sm leading-snug">{role.title}</h3>
          <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 ${cfg.badge}`}>
            {cfg.label}
          </span>
        </div>
        <p className="text-[#8a94a6] text-xs leading-relaxed flex-1">{role.responsibility}</p>
        <div className="border-t border-white/5 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#c99a3c] mb-1">Why it matters</p>
          <p className="text-[#8a94a6] text-xs leading-relaxed italic">{role.importance}</p>
        </div>
      </div>
    </div>
  );
}

function AdvisoryCard({ role }: { role: Role }) {
  return (
    <div className="border border-white/10 bg-[#0b1f36] flex flex-col overflow-hidden hover:border-blue-400/30 transition-colors duration-200">
      <div className="h-[3px] bg-blue-400/40" />
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-white font-semibold text-sm leading-snug">{role.title}</h3>
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 text-blue-400 bg-blue-400/10 border border-blue-400/30">
            Advisory Seat
          </span>
        </div>
        <p className="text-[#8a94a6] text-xs leading-relaxed flex-1">{role.responsibility}</p>
        <div className="border-t border-white/5 pt-3">
          <p className="text-[#8a94a6] text-xs leading-relaxed italic">{role.importance}</p>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  label,
  title,
  description,
  groupId,
}: {
  label: string;
  title: string;
  description: string;
  groupId: string;
}) {
  const accent =
    groupId === "leadership"
      ? "border-l-[#c99a3c]"
      : groupId === "event-ops"
        ? "border-l-amber-400"
        : groupId === "media"
          ? "border-l-blue-400"
          : groupId === "technology"
            ? "border-l-purple-400"
            : "border-l-white/30";

  return (
    <div className={`border-l-2 pl-5 ${accent}`}>
      <p className="text-[#c99a3c] text-[10px] font-semibold uppercase tracking-[0.25em] mb-1">{label}</p>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-[#8a94a6] text-sm leading-relaxed max-w-2xl">{description}</p>
    </div>
  );
}

// ── page ───────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const data = getTeamData();
  const groups = data.groups;
  const leadership = groups.find((g) => g.id === "leadership")!;
  const eventOps = groups.find((g) => g.id === "event-ops")!;
  const media = groups.find((g) => g.id === "media")!;
  const technology = groups.find((g) => g.id === "technology")!;
  const advisory = groups.find((g) => g.id === "advisory")!;

  return (
    <div className="min-h-screen bg-[#071426]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#050f1e] border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#c99a3c] to-transparent" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 60px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 60px)" }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <p className="text-[#c99a3c] text-[10px] font-semibold uppercase tracking-[0.3em] mb-6">
            TROPTIONS Sports Network
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.05] max-w-4xl mb-6">
            The Team Behind<br />TROPTIONS Sports Network
          </h1>
          <p className="text-[#8a94a6] text-lg max-w-3xl leading-relaxed mb-8">
            TROPTIONS Sports Network brings together sports media, event commerce, sponsor activation, local merchant networks, charity campaigns, and Solana-powered digital moments. We are building the operating company behind it.
          </p>
          <div className="inline-block border border-white/10 bg-[#0b1f36] px-4 py-3 text-xs text-[#8a94a6] max-w-2xl leading-relaxed">
            Built for FIFA-scale and World Cup-style event activations. No official FIFA, ESPN, or Octagon affiliation is claimed unless separately contracted.
          </div>
        </div>
      </section>

      {/* ── Operating Model ──────────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-[#c99a3c] text-[10px] font-semibold uppercase tracking-[0.25em] mb-2">
              Operating Model
            </p>
            <h2 className="text-3xl font-bold text-white mb-3">
              Agency. Broadcast. Event Commerce. Solana Infrastructure.
            </h2>
            <p className="text-[#8a94a6] text-sm max-w-2xl leading-relaxed">
              TROPTIONS Sports Network operates across six integrated layers. Each layer has a dedicated team, technology, and revenue surface.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.operating_model.map((layer) => (
              <div
                key={layer.id}
                className={`border bg-[#0b1f36] p-6 transition-colors duration-200 ${LAYER_ACCENT[layer.accent] ?? "border-white/10 hover:border-white/20"}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${LAYER_DOT[layer.accent] ?? "bg-white/30"}`} />
                  <p className={`text-xs font-semibold uppercase tracking-wider ${LAYER_LABEL[layer.accent] ?? "text-white"}`}>
                    {layer.label}
                  </p>
                </div>
                <p className="text-[#8a94a6] text-xs leading-relaxed">{layer.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership ───────────────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <SectionHeader
              label="01 — Leadership"
              title={leadership.label}
              description={leadership.description}
              groupId="leadership"
            />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leadership.roles.map((role) => (
              <RoleCard key={role.title} role={role} groupId="leadership" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Event Operations ─────────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <SectionHeader
              label="02 — Event Operations"
              title={eventOps.label}
              description={eventOps.description}
              groupId="event-ops"
            />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventOps.roles.map((role) => (
              <RoleCard key={role.title} role={role} groupId="event-ops" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Media Team ───────────────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <SectionHeader
              label="03 — Media"
              title={media.label}
              description={media.description}
              groupId="media"
            />
            <p className="text-[#8a94a6] text-xs mt-4 max-w-xl">
              Powered by TROPTIONS Television Network. Programming, production, and content distribution for matchday activations.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.roles.map((role) => (
              <RoleCard key={role.title} role={role} groupId="media" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Technology Team ──────────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <SectionHeader
              label="04 — Technology"
              title={technology.label}
              description={technology.description}
              groupId="technology"
            />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technology.roles.map((role) => (
              <RoleCard key={role.title} role={role} groupId="technology" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Advisory Board ───────────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-20 px-6 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="border-l-2 border-l-white/20 pl-5">
              <p className="text-[#c99a3c] text-[10px] font-semibold uppercase tracking-[0.25em] mb-1">05 — Advisory</p>
              <h2 className="text-2xl font-bold text-white mb-2">{advisory.label}</h2>
              <p className="text-[#8a94a6] text-sm leading-relaxed max-w-2xl">{advisory.description}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {advisory.roles.map((role) => (
              <AdvisoryCard key={role.title} role={role} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Status Legend ────────────────────────────────────────────────── */}
      <section className="border-b border-white/5 py-10 px-6 bg-[#050f1e]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#8a94a6] text-[10px] uppercase tracking-widest mb-4 font-semibold">Role Status Key</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-[#8a94a6] text-xs">Active — role is filled</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[#8a94a6] text-xs">Role Open — actively recruiting or hiring</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-[#8a94a6] text-xs">Advisory Seat — domain expert sought</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c99a3c] text-[10px] font-semibold uppercase tracking-[0.3em] mb-5">Join the Network</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Help build the event commerce network.
          </h2>
          <p className="text-[#8a94a6] text-base max-w-2xl mx-auto leading-relaxed mb-10">
            We are staffing the core team, productionizing the Solana launcher, and running a FIFA-scale event activation pilot. Sponsors, partners, advisors, and hires are actively considered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link
              href="/sports/partners"
              className="px-8 py-3.5 bg-[#c99a3c] text-[#071426] font-semibold text-sm uppercase tracking-wider hover:bg-[#f0cf82] transition-colors"
            >
              Partner With TROPTIONS
            </Link>
            <Link
              href="/sports/funding"
              className="px-8 py-3.5 border border-[#c99a3c]/40 text-[#c99a3c] font-semibold text-sm uppercase tracking-wider hover:border-[#c99a3c] transition-colors"
            >
              View Funding Memo
            </Link>
            <Link
              href="/sports/proof"
              className="px-8 py-3.5 border border-white/20 text-[#8a94a6] font-semibold text-sm uppercase tracking-wider hover:border-white/40 hover:text-white transition-colors"
            >
              See Network Proof
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer disclaimer ────────────────────────────────────────────── */}
      <div className="border-t border-white/5 bg-[#050f1e] py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#8a94a6] text-xs leading-relaxed max-w-4xl">
            TROPTIONS Sports Network is an independent sports media, event commerce, and fan technology company. It is not affiliated with, endorsed by, or a partner of FIFA, the FIFA World Cup, ESPN, Fox Sports, Telemundo, Octagon, CAA Sports, or any official tournament broadcaster or sanctioning body unless separately disclosed. Digital moments and fan badges issued through this platform are collectibles and fan-engagement rewards. They are not investment products, securities, or instruments with guaranteed value or liquidity. All role descriptions reflect intended organizational structure and current recruiting priorities.
          </p>
        </div>
      </div>

    </div>
  );
}
