import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const { login, requestPasswordReset } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const requestedPath = (location.state as { from?: string } | null)?.from;
  const returnTo = requestedPath?.startsWith('/') && !requestedPath.startsWith('//')
    ? requestedPath
    : '/account';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.ok) navigate(returnTo, { replace: true });
      else if (res.error?.toLowerCase().includes('invalid login credentials')) {
        setError('Email or password is incorrect. If you just created your account, confirm your email first, or reset your password.');
      } else setError(res.error || 'Login failed');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Could not sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetPassword = async () => {
    setError('');
    setMessage('');
    setResettingPassword(true);
    try {
      const result = await requestPasswordReset(email);
      if (result.ok) {
        setMessage('If an account exists for this email, a password reset link will be sent.');
      } else {
        setError(result.error || 'Could not request a password reset.');
      }
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Could not request a password reset.');
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-charcoal-950">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-flame-gradient flex items-center justify-center shadow-glow" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Welcome back</h1>
        <p className="text-white/50 text-center mb-8 text-sm">Sign in to continue</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-2xl bg-charcoal-900 border border-white/10 pl-11 pr-4 py-3 text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full rounded-2xl bg-charcoal-900 border border-white/10 pl-11 pr-4 py-3 text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={resetPassword}
              disabled={!email.trim() || resettingPassword || submitting}
              className="text-sm text-ember-400 hover:text-ember-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resettingPassword ? 'Sending reset link…' : 'Forgot password?'}
            </button>
            <span className="text-xs text-white/40">Enter your email first</span>
          </div>

          {error && <p className="text-sm text-crimson-400 text-center">{error}</p>}
          {message && <p role="status" className="text-sm text-emerald-300 text-center">{message}</p>}

          <button type="submit" disabled={submitting} className="w-full h-14 rounded-2xl bg-flame-gradient text-white font-semibold flex items-center justify-center gap-2 shadow-glow disabled:cursor-wait disabled:opacity-60">
            <LogIn className="w-5 h-5" />
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-white/50 mt-6">
          Don't have an account? <Link to="/signup" state={{ from: returnTo }} className="text-ember-400 font-medium">Create one</Link>
        </p>
        <Link to="/" className="block text-center text-sm text-white/40 mt-4">Back to site</Link>
      </div>
    </div>
  );
}
