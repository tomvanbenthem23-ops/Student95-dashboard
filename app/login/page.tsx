'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || 'Inloggen mislukt');
        return;
      }
      const dest = params.get('from') || '/';
      router.push(dest);
      router.refresh();
    } catch {
      setError('Inloggen mislukt — probeer het opnieuw.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-[380px] rounded-l border border-line bg-surface p-8 shadow-s95"
      >
        <div className="mb-6 flex items-center gap-2 font-display text-[23px] uppercase leading-none">
          Student
          <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-blue text-[14px] normal-case text-blue">
            95
          </span>
        </div>
        <h1 className="mb-1.5 text-[18px] font-bold text-ink">Inloggen</h1>
        <p className="mb-5 text-[13px] text-muted">
          Voer het gedeelde wachtwoord in om bij het salesplan-dashboard te
          kunnen.
        </p>

        <label htmlFor="password" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted">
          Wachtwoord
        </label>
        <input
          id="password"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 w-full rounded-s border border-line2 bg-surface2 px-3.5 py-2.5 text-[14px] focus:border-blue focus:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
          aria-invalid={!!error}
          aria-describedby={error ? 'login-error' : undefined}
        />

        {error && (
          <p id="login-error" role="alert" className="mb-3 text-[13px] font-medium text-accent-dark">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || !password}
          className="w-full rounded-full bg-navy px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-navy-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Bezig…' : 'Inloggen'}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
