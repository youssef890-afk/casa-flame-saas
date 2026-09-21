import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password, remember)) {
      navigate('/admin');
    } else {
      setError('Email or password incorrect');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-charcoal-950">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-flame-gradient flex items-center justify-center shadow-glow mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Admin Access</h1>
          <p className="text-white/50 text-sm mt-1">Sign in to manage the restaurant</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@emynfc.com"
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
                placeholder="Enter password"
                required
                className="w-full rounded-2xl bg-charcoal-900 border border-white/10 pl-11 pr-4 py-3 text-white"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-5 h-5 accent-ember-500 rounded"
            />
            <span className="text-sm text-white/70">Keep me signed in</span>
          </label>

          {error && <p className="text-sm text-crimson-400 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full h-14 rounded-2xl bg-flame-gradient text-white font-semibold shadow-glow"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
          <p className="text-xs text-white/50">Default credentials:</p>
          <p className="text-xs text-white/80 mt-1 font-mono">admin@emynfc.com</p>
          <p className="text-xs text-white/80 font-mono">1234</p>
        </div>

        <button onClick={() => navigate('/')} className="w-full mt-4 text-sm text-white/40 hover:text-white">
          Back to site
        </button>
      </div>
    </div>
  );
}
