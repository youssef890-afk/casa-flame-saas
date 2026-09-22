import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, FileText, Shield, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export default function ProtocolPage() {
  const [accepted, setAccepted] = useState(false);
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAdminAuth();

  const allChecked = checked1 && checked2 && checked3;

  const handleAccept = () => {
    if (!allChecked) return;
    localStorage.setItem('casa_protocol_accepted', 'true');
    localStorage.setItem('casa_protocol_date', new Date().toISOString());
    setAccepted(true);
    setTimeout(() => navigate(isAdmin ? '/admin' : '/'), 1500);
  };

  if (accepted) {
    return (
      <div className="container-app py-20 max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="heading-lg mb-3">Protocol Accepted</h1>
        <p className="text-white/60">Welcome to emynfc platform.</p>
      </div>
    );
  }

  return (
    <div className="container-app py-10 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-3xl bg-flame-gradient flex items-center justify-center mx-auto mb-4 shadow-glow">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="heading-lg mb-2">Protocol & Agreement</h1>
        <p className="text-white/50 text-sm">
          Please read and accept before using the platform
        </p>
      </div>

      <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-6 sm:p-8 mb-6 max-h-[50vh] overflow-y-auto">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-ember-400" />
          Terms of Use
        </h2>

        <div className="space-y-4 text-sm text-white/70 leading-relaxed">
          <section>
            <h3 className="font-semibold text-white mb-2">1. Usage Rights</h3>
            <p>
              As the restaurant owner, you have full rights to manage your restaurant data,
              including menu items, prices, images, orders, and reservations.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-white mb-2">2. Data Ownership</h3>
            <p>
              All data you upload belongs to you. You can export, modify, or delete it at any time.
              The platform does not use your data for unauthorized purposes.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-white mb-2">3. Content Responsibility</h3>
            <p>
              You are responsible for the accuracy of the information you publish:
              prices, availability, allergen warnings, and customer communications.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-white mb-2">4. Customer Privacy</h3>
            <p>
              You agree to respect customer privacy. Customer phone numbers, addresses,
              and order history must be handled responsibly and never shared with third parties.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-white mb-2">5. Service Availability</h3>
            <p>
              The platform strives for 99% uptime, but is provided "as-is" without guarantee
              of uninterrupted service. Scheduled maintenance may occur.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-white mb-2">6. Payment Terms</h3>
            <p>
              Subscription or setup fees must be paid as agreed. Failure to pay may result
              in temporary suspension of access.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-white mb-2">7. Prohibited Activities</h3>
            <p>
              You may not use the platform for illegal activities, spam, misleading
              information, or to harm other users.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-white mb-2">8. Termination</h3>
            <p>
              Either party may terminate this agreement at any time. Your data will remain
              accessible for 30 days after termination.
            </p>
          </section>
        </div>
      </div>

      <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-6 mb-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          Confirmation
        </h3>

        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-2xl hover:bg-white/5 transition">
            <input
              type="checkbox"
              checked={checked1}
              onChange={(e) => setChecked1(e.target.checked)}
              className="w-5 h-5 accent-ember-500 rounded mt-0.5 shrink-0"
            />
            <span className="text-sm text-white/80">
              I have read and understood the Terms of Use
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-2xl hover:bg-white/5 transition">
            <input
              type="checkbox"
              checked={checked2}
              onChange={(e) => setChecked2(e.target.checked)}
              className="w-5 h-5 accent-ember-500 rounded mt-0.5 shrink-0"
            />
            <span className="text-sm text-white/80">
              I confirm that I am the authorized owner or manager of this restaurant
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-2xl hover:bg-white/5 transition">
            <input
              type="checkbox"
              checked={checked3}
              onChange={(e) => setChecked3(e.target.checked)}
              className="w-5 h-5 accent-ember-500 rounded mt-0.5 shrink-0"
            />
            <span className="text-sm text-white/80">
              I agree to respect customer privacy and handle their data responsibly
            </span>
          </label>
        </div>
      </div>

      <button
        onClick={handleAccept}
        disabled={!allChecked}
        className={
          'w-full h-14 rounded-2xl font-semibold transition flex items-center justify-center gap-2 ' +
          (allChecked
            ? 'bg-flame-gradient text-white shadow-glow'
            : 'bg-white/5 text-white/30 cursor-not-allowed')
        }
      >
        <CheckCircle2 className="w-5 h-5" />
        Accept Protocol
      </button>

      <div className="text-center mt-4">
        <Link to="/" className="text-sm text-white/40 hover:text-white">
          Back to site
        </Link>
      </div>
    </div>
  );
}
