import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checkingLink, setCheckingLink] = useState(true);
  const [validLink, setValidLink] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const recoveryLink = new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery';

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session && active) {
        setValidLink(true);
        setCheckingLink(false);
      }
    });

    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) setError('Could not verify the reset link. Request a new one and try again.');
      setValidLink(recoveryLink && Boolean(data.session));
      setCheckingLink(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await updatePassword(password);
      if (!result.ok) {
        setError(result.error || 'Could not update your password.');
        return;
      }

      setMessage('Your password has been updated. Redirecting to sign in…');
      window.setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Could not update your password.');
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
        <h1 className="text-2xl font-bold text-center mb-2">Reset password</h1>

        {checkingLink ? (
          <p role="status" className="text-white/50 text-center my-8 text-sm">Verifying your reset link…</p>
        ) : !validLink ? (
          <div className="space-y-5">
            <p className="text-white/60 text-center my-8 text-sm">
              This reset link is invalid or expired. Request a new one from the sign-in page.
            </p>
            <Link to="/login" className="block text-center text-ember-400 font-medium">Back to sign in</Link>
          </div>
        ) : (
          <>
            <p className="text-white/50 text-center mb-8 text-sm">Choose a new password with at least 8 characters.</p>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">New password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={8}
                    autoComplete="new-password"
                    required
                    className="w-full rounded-2xl bg-charcoal-900 border border-white/10 pl-11 pr-4 py-3 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2">Confirm new password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    minLength={8}
                    autoComplete="new-password"
                    required
                    className="w-full rounded-2xl bg-charcoal-900 border border-white/10 pl-11 pr-4 py-3 text-white"
                  />
                </div>
              </div>
              {error && <p role="alert" className="text-sm text-crimson-400 text-center">{error}</p>}
              {message && <p role="status" className="text-sm text-emerald-300 text-center">{message}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-14 rounded-2xl bg-flame-gradient text-white font-semibold flex items-center justify-center gap-2 shadow-glow disabled:cursor-wait disabled:opacity-60"
              >
                <Save className="w-5 h-5" />
                {submitting ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
