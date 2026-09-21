const reservations = [
  { id: 'R-201', name: 'Ahmed El Fassi', phone: '+212 661 000 001', guests: 4, date: '2026-06-12', time: '20:00', status: 'Confirmed' },
  { id: 'R-202', name: 'Sarah Bennani', phone: '+212 662 000 002', guests: 2, date: '2026-06-12', time: '20:30', status: 'Pending' },
  { id: 'R-203', name: 'Marc Dupont', phone: '+212 663 000 003', guests: 6, date: '2026-06-13', time: '19:30', status: 'Confirmed' },
  { id: 'R-204', name: 'Nadia Cherkaoui', phone: '+212 664 000 004', guests: 3, date: '2026-06-13', time: '21:00', status: 'Confirmed' },
];

const statusColor: Record<string, string> = {
  Confirmed: 'bg-emerald-500/15 text-emerald-300',
  Pending: 'bg-amber-500/15 text-amber-300',
};

export default function ReservationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reservations</h1>
        <p className="text-white/50 text-sm mt-1">Table bookings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reservations.map((r) => (
          <div key={r.id} className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold">{r.name}</p>
                <p className="text-xs text-white/50">{r.phone}</p>
              </div>
              <span className={'px-2.5 py-1 rounded-full text-xs font-medium ' + statusColor[r.status]}>
                {r.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>{r.date} - {r.time}</span>
              <span>{r.guests} guests</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
