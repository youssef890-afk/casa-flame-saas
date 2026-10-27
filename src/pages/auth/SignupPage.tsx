import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
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
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setSubmitting(true);
    try {
      const res = await signup(name, email, password);
      if (!res.ok) setError(res.error || 'Signup failed');
      else if (res.needsEmailConfirmation) setMessage('Check your email to confirm your account, then sign in.');
      else navigate(returnTo, { replace: true });
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : 'Could not create your account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-charcoal-950">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-flame-gradient flex items-center justify-center shadow-glow" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Create account</h1>
        <p className="text-white/50 text-center mb-8 text-sm">Start earning coins and rewards</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full rounded-2xl bg-charcoal-900 border border-white/10 pl-11 pr-4 py-3 text-white"
              />
            </div>
          </div>
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
                placeholder="At least 8 characters"
                minLength={8}
                required
                className="w-full rounded-2xl bg-charcoal-900 border border-white/10 pl-11 pr-4 py-3 text-white"
              />
            </div>
          </div>

          {error && <p className="text-sm text-crimson-400 text-center">{error}</p>}
          {message && <p role="status" className="text-sm text-emerald-300 text-center">{message}</p>}

          <button type="submit" disabled={submitting} className="w-full h-14 rounded-2xl bg-flame-gradient text-white font-semibold flex items-center justify-center gap-2 shadow-glow disabled:cursor-wait disabled:opacity-60">
            <UserPlus className="w-5 h-5" />
            {submitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-white/50 mt-6">
          Already have an account? <Link to="/login" state={{ from: returnTo }} className="text-ember-400 font-medium">Sign in</Link>
        </p>
        <Link to="/" className="block text-center text-sm text-white/40 mt-4">Back to site</Link>
      </div>
    </div>
  );
}
