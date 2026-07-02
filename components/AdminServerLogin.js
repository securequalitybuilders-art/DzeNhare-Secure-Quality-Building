'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '../lib/supabase-browser';

export default function AdminServerLogin({ nextPath = '/admin/submissions' }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (!supabaseBrowser) {
      setError('Supabase browser client is not configured.');
      return;
    }

    setPending(true);
    setError('');

    const { error: signInError } = await supabaseBrowser.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message || 'Unable to sign in.');
      setPending(false);
      return;
    }

    // Final admin authorization happens server-side in protected routes.
    router.push(nextPath);
    router.refresh();
  }

  return (
    <div className="card">
      <div className="label-row">
        <span className="tag red">Protected</span>
        <span className="tag">Supabase Auth</span>
      </div>
      <h3>Admin sign-in</h3>
      <p style={{ marginBottom: 16 }}>Use an approved admin email and password. Authorization is verified server-side.</p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email" />
        <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? 'Signing in...' : 'Sign in'}</button>
      </form>
      {error ? <div className="form-status error">{error}</div> : null}
    </div>
  );
}
