'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/troptions/gated/downloads');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(160deg, #071426 0%, #0c1e35 60%, #071426 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
    >
      <div style={{ maxWidth: 380, width: '100%' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '2rem',
              fontWeight: 700,
              color: '#f8fafc',
              margin: '0 0 0.5rem',
            }}
          >
            Create Account
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0 0 1rem' }}>
            Register to access institutional materials
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '0.75rem',
            padding: '2rem',
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
              Email
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '0.5rem',
                color: '#f8fafc',
                fontSize: '0.9rem',
              }}
              placeholder='your@email.com'
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '0.5rem',
                color: '#f8fafc',
                fontSize: '0.9rem',
              }}
              placeholder='At least 8 characters'
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem' }}>
              <p style={{ color: '#f87171', fontSize: '0.85rem', margin: 0 }}>{error}</p>
            </div>
          )}

          <button
            type='submit'
            disabled={loading}
            style={{
              width: '100%',
              background: '#f0cf82',
              color: '#071426',
              padding: '0.85rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              fontSize: '0.95rem',
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: 0 }}>
              Already have an account?{' '}
              <Link
                href='/troptions/auth/login'
                style={{ color: '#f0cf82', textDecoration: 'none', fontWeight: 600 }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link href='/troptions' style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
