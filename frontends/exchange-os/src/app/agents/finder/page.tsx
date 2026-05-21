'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AGENT_GOAL_LABELS, AGENT_GOAL_KEYS } from '@/lib/agents/findAgent';
import { AGENT_REGISTRY, findAgentsByGoal } from '@/data/agentRegistry';
import type { AgentDefinition } from '@/data/agentRegistry';

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  active:      { label: 'ACTIVE',      color: '#22c55e' },
  demo:        { label: 'DEMO',        color: '#c4a84a' },
  coming_soon: { label: 'COMING SOON', color: '#6b7280' },
  disabled:    { label: 'DISABLED',    color: '#4b5563' },
};

export default function AgentFinderPage() {
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [results, setResults] = useState<AgentDefinition[]>([]);

  function handleGoalChange(goal: string) {
    setSelectedGoal(goal);
    setResults(goal ? findAgentsByGoal(goal) : []);
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
      <p style={{ fontSize: '0.75rem', color: '#c4a84a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
        AI Intelligence
      </p>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#e8e0d0', marginBottom: '0.75rem' }}>
        Agent Finder
      </h1>
      <p style={{ color: '#9ca3af', marginBottom: '0.75rem', maxWidth: 600, lineHeight: 1.7 }}>
        Select your goal and we will recommend the right AI agent for your task.
        All agents are in demo mode. Read-only by default.
      </p>

      {/* Demo mode banner */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.7rem', background: '#1a1500', border: '1px solid #f59e0b44', borderRadius: 4, marginBottom: '1.75rem' }}>
        <span style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: 700 }}>DEMO MODE</span>
        <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Agents are illustrative — no live AI execution</span>
      </div>

      {/* Goal selector */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.5rem', fontWeight: 600 }}>
          What is your goal?
        </label>
        <select
          value={selectedGoal}
          onChange={(e) => handleGoalChange(e.target.value)}
          style={{
            width: '100%',
            maxWidth: 480,
            padding: '0.65rem 1rem',
            background: '#0d1526',
            border: '1px solid #1e3058',
            borderRadius: 6,
            color: '#e8e0d0',
            fontSize: '0.9rem',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="">— Select a goal —</option>
          {AGENT_GOAL_KEYS.map((key) => (
            <option key={key} value={key}>{AGENT_GOAL_LABELS[key]}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      {selectedGoal && results.length === 0 && (
        <div style={{ color: '#6b7280', fontSize: '0.85rem', padding: '1rem', background: '#0d1526', borderRadius: 8, border: '1px solid #1e3058' }}>
          No agents found for this goal. Try a different selection or view the{' '}
          <Link href="/agents" style={{ color: '#c4a84a' }}>full registry</Link>.
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h2 style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '1rem', fontWeight: 600 }}>
            Recommended agents for: <span style={{ color: '#c4a84a' }}>{AGENT_GOAL_LABELS[selectedGoal]}</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {results.map((agent, idx) => {
              const badge = STATUS_BADGE[agent.status];
              return (
                <div key={agent.id} style={{ background: '#0d1526', border: '1px solid #1e3058', borderRadius: 10, padding: '1.5rem', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', width: 22, height: 22, background: '#1e3058', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#c4a84a', fontWeight: 700 }}>
                    {idx + 1}
                  </div>
                  <div style={{ paddingLeft: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ color: '#e8e0d0', fontSize: '1rem', fontWeight: 600 }}>{agent.name}</h3>
                      <span style={{ fontSize: '0.62rem', padding: '0.2rem 0.55rem', borderRadius: 4, background: '#111', color: badge.color, border: `1px solid ${badge.color}44` }}>
                        {badge.label}
                      </span>
                    </div>
                    <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {agent.description}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      {/* Can do */}
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#22c55e', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Can Do</div>
                        <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#9ca3af', fontSize: '0.78rem', lineHeight: 1.6 }}>
                          {agent.canUseRag && <li>RAG search over approved sources</li>}
                          <li>Answer questions from {agent.allowedSources.slice(0, 2).join(', ')}</li>
                          {!agent.requiresHumanApproval && <li>Respond without human approval</li>}
                          {agent.requiresHumanApproval && <li>Draft responses (human review required)</li>}
                        </ul>
                      </div>
                      {/* Cannot do */}
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#ef4444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Cannot Do</div>
                        <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#9ca3af', fontSize: '0.78rem', lineHeight: 1.6 }}>
                          {agent.prohibitedActions.slice(0, 4).map((action) => (
                            <li key={action}>{action.replace(/_/g, ' ')}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Source note */}
                    <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: '#4b5563', borderTop: '1px solid #1e3058', paddingTop: '0.65rem' }}>
                      Approved sources: {agent.allowedSources.join(', ')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All agents summary */}
      {!selectedGoal && (
        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ color: '#6b7280', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
            {AGENT_REGISTRY.length} agents available in the registry. Select a goal above to find the right match.
          </p>
          <Link href="/agents" style={{ color: '#c4a84a', fontSize: '0.85rem', textDecoration: 'none' }}>
            View full agent registry →
          </Link>
        </div>
      )}

      <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link href="/agents" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.85rem' }}>
          ← Agent Registry
        </Link>
        <Link href="/x402" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.85rem' }}>
          x402 Intelligence
        </Link>
        <Link href="/exchange-os" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.85rem' }}>
          Exchange OS
        </Link>
      </div>
    </div>
  );
}
