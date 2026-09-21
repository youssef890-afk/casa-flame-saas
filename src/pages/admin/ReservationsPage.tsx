import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useReservations, type ReservationStatus } from '../../contexts/ReservationsContext';
import { cn } from '../../lib/utils';

const statusOptions: ReservationStatus[] = ['pending', 'confirmed', 'seated', 'completed', 'cancelled'];

const statusColor: Record<ReservationStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  confirmed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  seated: 'bg-sky-500/15 text-sky-300 border-sky-500/25',
  completed: 'bg-white/10 text-white/60 border-white/10',
  cancelled: 'bg-crimson-500/15 text-crimson-300 border-crimson-500/25',
};

export default function ReservationsPage() {
  const { reservations, addReservation, updateStatus, deleteReservation, stats } = useReservations();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', guests: 2, date: '', time: '', table: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date || !form.time) return;
    addReservation({
      id: 'R-' + (201 + reservations.length + 1),
      name: form.name,
      phone: form.phone,
      guests: Number(form.guests),
      date: form.date,
      time: form.time,
      status: 'pending',
      table: form.table || undefined,
    });
    setForm({ name: '', phone: '', guests: 2, date: '', time: '', table: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Reservations</h1>
          <p className="text-white/50 text-sm mt-1">{reservations.length} total</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-flame-gradient text-white font-semibold shadow-glow"
        >
          <Plus className="w-4 h-4" />
          New Reservation
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-charcoal-900/60 border border-white/5 p-4">
          <p className="text-xs text-white/50">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-2xl bg-charcoal-900/60 border border-white/5 p-4">
          <p className="text-xs text-white/50">Pending</p>
          <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
        </div>
        <div className="rounded-2xl bg-charcoal-900/60 border border-white/5 p-4">
          <p className="text-xs text-white/50">Confirmed</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.confirmed}</p>
        </div>
      </div>

      <div className="space-y-3">
        {reservations.map((r) => (
          <div key={r.id} className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-bold">{r.name}</p>
                <p className="text-xs text-white/50">{r.phone}</p>
              </div>
              <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border capitalize', statusColor[r.status])}>
                {r.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-white/60 mb-4">
              <span>{r.date} - {r.time}</span>
              <span>{r.guests} guests{r.table ? ' - ' + r.table : ''}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(r.id, s)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-medium border capitalize transition',
                    r.status === s ? statusColor[s] : 'bg-white/5 border-white/10 text-white/60'
                  )}
                >
                  {s}
                </button>
              ))}
              <button
                onClick={() => { if (confirm('Delete reservation?')) deleteReservation(r.id); }}
                className="ml-auto p-2 rounded-xl hover:bg-crimson-500/10 text-crimson-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {reservations.length === 0 && (
          <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-10 text-center">
            <p className="text-white/40">No reservations yet</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-y-auto">
          <div className="w-full max-w-lg bg-charcoal-900 rounded-3xl border border-white/10 my-8">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="font-bold">New Reservation</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submit} className="p-5 space-y-4">
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Customer name"
                required
                className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="Phone"
                required
                className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  min="1"
                  value={form.guests}
                  onChange={(e) => setForm((f) => ({ ...f, guests: Number(e.target.value) }))}
                  placeholder="Guests"
                  className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white"
                />
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  required
                  className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white"
                />
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  required
                  className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white"
                />
              </div>
              <input
                value={form.table}
                onChange={(e) => setForm((f) => ({ ...f, table: e.target.value }))}
                placeholder="Table (optional)"
                className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white"
              />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold">
                  Cancel
                </button>
                <button type="submit" className="flex-1 h-12 rounded-2xl bg-flame-gradient text-white font-semibold">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
