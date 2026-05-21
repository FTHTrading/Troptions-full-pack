import Link from 'next/link';
import { AGENT_REGISTRY } from '@/data/agentRegistry';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Agents | TROPTIONS Intelligence',
  description:
    'AI agent registry for the TROPTIONS ecosystem. Demo agents for exchange OS analysis, token proof, DEX readiness, and partner onboarding. Read-only by default.',
};

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  active:      { label: 'ACTIVE',       color: '#22c55e' },
  demo:        { label: 'DEMO',         color: '#c4a84a' },
  coming_soon: { label: 'COMING SOON',  color: '#6b7280' },
  disabled:    { label: 'DISABLED',     color: '#4b5563' },
};

const CATEGORY_COLORS: Record<string, string> = {
  exchange:   '#60a5fa',
  proof:      '#c4a84a',
  solana:     '#a78bfa',
  xrpl:       '#34d399',
  payments:   '#f59e0b',
  compliance: '#ef4444',
  onboarding: '#22c55e',
  content:    '#06b6d4',
  language:   '#f97316',
};

export default function AgentsPage() {
  const categories = [...new Set(AGENT_REGISTRY.map((a) => a.category))];

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
      {/* Header */}
      <p style={{ fontSize: '0.75rem', color: '#c4a84a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
        Intelligence Layer
      </p>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#e8e0d0', marginBottom: '0.75rem' }}>
        AI Agent Registry
      </h1>
      <p style={{ color: '#9ca3af', marginBottom: '1rem', maxWidth: 680, lineHeight: 1.7 }}>
        {AGENT_REGISTRY.length} registered agents for the TROPTIONS ecosystem. All agents are in demo mode and read-only by default.
        No agent can execute shell commands, sign wallets, transfer tokens, or perform live trading.
      </p>

      {/* Policy strip */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem', padding: '0.85rem 1rem', background: '#0d1526', border: '1px solid #1e3058', borderRadius: 8 }}>
        {[
          { label: 'Mode', value: 'Demo' },
          { label: 'Default', value: 'Read-Only' },
          { label: 'Shell Execution', value: 'Blocked' },
          { label: 'Wallet Access', value: 'Blocked' },
          { label: 'Live Trading', value: 'Blocked' },
          { label: 'Investment Advice', value: 'Blocked' },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ fontSize: '0.6rem', color: '#6b7280', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontSize: '0.82rem', color: value === 'Blocked' ? '#ef4444' : '#22c55e', fontWeight: 600 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Agent grid by category */}
      {categories.map((cat) => {
        const agents = AGENT_REGISTRY.filter((a) => a.category === cat);
        return (
          <div key={cat} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '0.75rem', color: CATEGORY_COLORS[cat] ?? '#9ca3af', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              {cat}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '0.85rem' }}>
              {agents.map((agent) => {
                const badge = STATUS_BADGE[agent.status];
                return (
                  <div key={agent.id} style={{ background: '#0d1526', border: '1px solid #1e3058', borderRadius: 8, padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ color: '#e8e0d0', fontSize: '0.95rem', fontWeight: 600 }}>{agent.name}</h3>
                      <span style={{ fontSize: '0.62rem', padding: '0.2rem 0.55rem', borderRadius: 4, background: '#111', color: badge.color, border: `1px solid ${badge.color}44`, flexShrink: 0 }}>
                        {badge.label}
                      </span>
                    </div>
                    <p style={{ color: '#9ca3af', fontSize: '0.83rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                      {agent.description}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.72rem' }}>
                      <div>
                        <span style={{ color: '#6b7280' }}>RAG: </span>
                        <span style={{ color: agent.canUseRag ? '#22c55e' : '#6b7280' }}>{agent.canUseRag ? 'Yes' : 'No'}</span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>Write: </span>
                        <span style={{ color: agent.canWrite ? '#f59e0b' : '#22c55e' }}>{agent.canWrite ? 'Yes' : 'No (read-only)'}</span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>Human Approval: </span>
                        <span style={{ color: agent.requiresHumanApproval ? '#f59e0b' : '#9ca3af' }}>{agent.requiresHumanApproval ? 'Required' : 'Not required'}</span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>x402: </span>
                        <span style={{ color: '#9ca3af' }}>{agent.x402Required ? 'Required' : 'Free'}</span>
                      </div>
                    </div>
                    <div style={{ marginTop: '0.75rem', fontSize: '0.68rem', color: '#4b5563' }}>
                      Blocked: {agent.prohibitedActions.join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <Link href="/agents/finder" style={{ display: 'inline-block', padding: '0.6rem 1.25rem', background: '#c4a84a', color: '#000', borderRadius: 6, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
          Find Agent by Goal
        </Link>
        <Link href="/x402" style={{ display: 'inline-block', padding: '0.6rem 1.25rem', background: 'transparent', border: '1px solid #1e3058', color: '#9ca3af', borderRadius: 6, fontSize: '0.85rem', textDecoration: 'none' }}>
          x402 Intelligence
        </Link>
      </div>
    </div>
  );
}
