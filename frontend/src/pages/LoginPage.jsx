import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Shield, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage({ onSwitchToSignup }) {
  const { login, guestLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err?.error || err?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    setError('');
    setGuestLoading(true);
    try {
      await guestLogin();
    } catch (err) {
      setError(err?.error || err?.message || 'Failed to start demo session.');
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#12171E] border border-slate-800/80 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold flex items-center justify-center mx-auto mb-3 text-lg">
            S
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">SIGNAL</h1>
          <p className="text-xs text-slate-400 mt-1">What actually changed since you looked.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg flex items-center gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#171E27] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#171E27] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading || guestLoading}
            className="w-full mt-2 py-2.5 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enter SIGNAL'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleGuestAccess}
            disabled={loading || guestLoading}
            className="w-full py-2 px-4 rounded-lg bg-slate-850 hover:bg-slate-800 text-cyan-300 border border-slate-700/80 font-medium text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {guestLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Entering SIGNAL...</span>
              </>
            ) : (
              <>⚡ Instant Demo Access (Guest Mode)</>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-cyan-400 hover:underline font-medium"
          >
            Create one
          </button>
        </div>
      </div>
    </div>
  );
}
