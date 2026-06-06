import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin, adminMe, auth } from '../api';
import { LogIn, Lock } from 'lucide-react';

export default function AdminLogin() {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    // If already logged in, jump to dashboard
    const t = auth.get();
    if (!t) return;
    adminMe().then(() => nav('/admin/dashboard', { replace: true })).catch(() => auth.clear());
  }, [nav]);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const { access_token } = await adminLogin(u, p);
      auth.set(access_token);
      nav('/admin/dashboard', { replace: true });
    } catch (e2) {
      setErr('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-shell flex items-center justify-center px-4">
      <form onSubmit={submit} className="admin-card w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3" style={{ background: 'var(--ahps-primary)', color: '#fff' }}>
            <Lock size={20}/>
          </div>
          <h1 className="font-display text-3xl">Admin Login</h1>
          <p className="text-sm text-neutral-500 mt-1">Album House Prop Store CMS</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="admin-label">Username</label>
            <input className="admin-input" value={u} onChange={(e) => setU(e.target.value)} required autoFocus />
          </div>
          <div>
            <label className="admin-label">Password</label>
            <input type="password" className="admin-input" value={p} onChange={(e) => setP(e.target.value)} required />
          </div>
          {err && <p className="text-sm text-[var(--ahps-primary)]">{err}</p>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            <LogIn size={16}/> {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
        <p className="text-[11px] text-neutral-500 text-center mt-5">
          Default credentials: <span className="font-mono">admin</span> / <span className="font-mono">albumhouse2026</span>
        </p>
      </form>
    </div>
  );
}
