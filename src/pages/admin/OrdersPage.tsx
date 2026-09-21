import { formatPrice } from '../../lib/utils';

const orders = [
  { id: '#1042', customer: 'Youssef B.', items: 3, total: 195, status: 'Preparing', time: '12:24' },
  { id: '#1041', customer: 'Salma R.', items: 2, total: 130, status: 'Ready', time: '12:15' },
  { id: '#1040', customer: 'Karim A.', items: 5, total: 320, status: 'Delivered', time: '12:02' },
  { id: '#1039', customer: 'Lina M.', items: 1, total: 65, status: 'Pending', time: '11:58' },
  { id: '#1038', customer: 'Omar T.', items: 4, total: 240, status: 'Delivered', time: '11:42' },
];

const statusColor: Record<string, string> = {
  Pending: 'bg-amber-500/15 text-amber-300',
  Preparing: 'bg-sky-500/15 text-sky-300',
  Ready: 'bg-emerald-500/15 text-emerald-300',
  Delivered: 'bg-white/10 text-white/60',
};

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-white/50 text-sm mt-1">Manage incoming orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((o) => (
          <div key={o.id} className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold">{o.id}</p>
                <p className="text-sm text-white/50">{o.customer}</p>
              </div>
              <span className={'px-2.5 py-1 rounded-full text-xs font-medium ' + statusColor[o.status]}>
                {o.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">{o.items} items</span>
              <span className="font-bold text-ember-400">{formatPrice(o.total)}</span>
            </div>
            <p className="text-xs text-white/40 mt-2">{o.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
