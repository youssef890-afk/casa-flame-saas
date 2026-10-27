import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const fullNamePattern = /^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)+$/u;
const phonePattern = /^\+?[\d\s().-]+$/;

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    const normalizedName = name.trim().replace(/\s+/g, ' ');
    const digitCount = phone.replace(/\D/g, '').length;

    if (!fullNamePattern.test(normalizedName)) {
      setError('Enter your real first and last name using letters only.');
      return;
    }
    if (!phonePattern.test(phone.trim()) || digitCount < 8 || digitCount > 15) {
      setError('Enter a valid phone number with 8 to 15 digits.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await signup(normalizedName, email, phone.trim(), password);
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
                placeholder="Your first and last name"
                autoComplete="name"
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
                autoComplete="email"
                required
                className="w-full rounded-2xl bg-charcoal-900 border border-white/10 pl-11 pr-4 py-3 text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2">Phone number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+212 6 12 34 56 78"
                autoComplete="tel"
                pattern="\+?[\d\s().-]+"
                required
                className="w-full rounded-2xl bg-charcoal-900 border border-white/10 pl-11 pr-4 py-3 text-white"
              />
            </div>
            <p className="text-xs text-white/40 mt-1">Use 8 to 15 digits, with country code if needed.</p>
          </div>
          <div>
            <label className="block text-sm mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full rounded-2xl bg-charcoal-900 border border-white/10 pl-11 pr-12 py-3 text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2">Confirm password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter your password again"
                autoComplete="new-password"
                required
                className="w-full rounded-2xl bg-charcoal-900 border border-white/10 pl-11 pr-12 py-3 text-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
                aria-pressed={showConfirmPassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
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
