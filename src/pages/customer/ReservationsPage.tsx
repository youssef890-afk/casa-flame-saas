import { useState } from 'react';
import { CalendarClock, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export default function ReservationsPage() {
  const { success } = useToast();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="container-app py-20 max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-6 text-emerald-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="heading-lg mb-3">Reservation confirmed</h1>
        <p className="text-white/60 mb-8">We look forward to hosting you at Casa Flame.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="h-12 px-6 rounded-2xl bg-white/10 border border-white/10 text-white font-semibold"
        >
          Book another
        </button>
      </div>
    );
  }

  return (
    <div className="container-app py-10">
      <div className="max-w-2xl mx-auto">
        <p className="text-ember-400 text-sm tracking-widest uppercase mb-2">Reservations</p>
        <h1 className="heading-lg mb-3">Reserve your table</h1>
        <p className="text-white/60 mb-8">Book in seconds. We hold your table for 15 minutes.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            success('Reservation sent!', 'We will confirm shortly.');
            setSubmitted(true);
          }}
          className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-6 sm:p-8 space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Full name</label>
              <input
                required
                placeholder="Your name"
                className="w-full rounded-2xl bg-charcoal-950/60 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-ember-500/60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Phone</label>
              <input
                required
                type="tel"
                placeholder="+212 6..."
                className="w-full rounded-2xl bg-charcoal-950/60 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-ember-500/60"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Date</label>
              <input
                required
                type="date"
                className="w-full rounded-2xl bg-charcoal-950/60 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-ember-500/60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Time</label>
              <input
                required
                type="time"
                className="w-full rounded-2xl bg-charcoal-950/60 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-ember-500/60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Guests</label>
              <select className="w-full rounded-2xl bg-charcoal-950/60 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-ember-500/60">
                {[1,2,3,4,5,6,7,8].map(n => (
                  <option key={n} value={n} className="bg-charcoal-900">{n}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Special requests</label>
            <textarea
              rows={3}
              placeholder="Allergies, occasion..."
              className="w-full rounded-2xl bg-charcoal-950/60 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-ember-500/60 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full h-14 rounded-2xl bg-flame-gradient text-white font-semibold flex items-center justify-center gap-2 shadow-glow"
          >
            <CalendarClock className="w-5 h-5" />
            Request reservation
          </button>
        </form>
      </div>
    </div>
  );
}
