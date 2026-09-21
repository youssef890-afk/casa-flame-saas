import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useOrders, type OrderStatus } from '../../contexts/OrdersContext';
import { formatPrice, cn } from '../../lib/utils';

const statusOptions: OrderStatus[] = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];

const statusColor: Record<OrderStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  preparing: 'bg-sky-500/15 text-sky-300 border-sky-500/25',
  ready: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  delivered: 'bg-white/10 text-white/60 border-white/10',
  cancelled: 'bg-crimson-500/15 text-crimson-300 border-crimson-500/25',
};

export default function OrdersPage() {
  const { orders, addOrder, updateStatus, deleteOrder, stats } = useOrders();
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customer: '', phone: '', items: 1, total: 0, table: '' });

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer || form.total <= 0) return;
    const newOrder = {
      id: '#' + (1042 + orders.length + 1),
      customer: form.customer,
      phone: form.phone,
      items: Number(form.items),
      total: Number(form.total),
      status: 'pending' as OrderStatus,
      time: new Date().toTimeString().slice(0, 5),
      table: form.table || undefined,
    };
    addOrder(newOrder);
    setForm({ customer: '', phone: '', items: 1, total: 0, table: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-white/50 text-sm mt-1">{orders.length} total</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-flame-gradient text-white font-semibold shadow-glow"
        >
          <Plus className="w-4 h-4" />
          New Order
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-charcoal-900/60 border border-white/5 p-4">
          <p className="text-xs text-white/50">Pending</p>
          <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
        </div>
        <div className="rounded-2xl bg-charcoal-900/60 border border-white/5 p-4">
          <p className="text-xs text-white/50">Preparing</p>
          <p className="text-2xl font-bold text-sky-400">{stats.preparing}</p>
        </div>
        <div className="rounded-2xl bg-charcoal-900/60 border border-white/5 p-4">
          <p className="text-xs text-white/50">Ready</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.ready}</p>
        </div>
        <div className="rounded-2xl bg-charcoal-900/60 border border-white/5 p-4">
          <p className="text-xs text-white/50">Today Revenue</p>
          <p className="text-xl font-bold text-ember-400">{formatPrice(stats.todayRevenue)}</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', ...statusOptions] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              'shrink-0 px-4 py-2 rounded-2xl text-sm font-medium border capitalize transition',
              filter === s
                ? 'bg-flame-gradient border-transparent text-white'
                : 'bg-white/5 border-white/10 text-white/70'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((o) => (
          <div key={o.id} className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-bold">{o.id}</p>
                <p className="text-sm text-white/50">{o.customer} - {o.phone}</p>
              </div>
              <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border capitalize', statusColor[o.status])}>
                {o.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm mb-4">
              <span className="text-white/50">{o.items} items - {o.time}{o.table ? ' - ' + o.table : ''}</span>
              <span className="font-bold text-ember-400">{formatPrice(o.total)}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(o.id, s)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-medium border capitalize transition',
                    o.status === s ? statusColor[s] : 'bg-white/5 border-white/10 text-white/60'
                  )}
                >
                  {s}
                </button>
              ))}
              <button
                onClick={() => { if (confirm('Delete order?')) deleteOrder(o.id); }}
                className="ml-auto p-2 rounded-xl hover:bg-crimson-500/10 text-crimson-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-10 text-center">
            <p className="text-white/40">No orders in this category</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-y-auto">
          <div className="w-full max-w-lg bg-charcoal-900 rounded-3xl border border-white/10 my-8">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="font-bold">New Order</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submit} className="p-5 space-y-4">
              <input
                value={form.customer}
                onChange={(e) => setForm((f) => ({ ...f, customer: e.target.value }))}
                placeholder="Customer name"
                required
                className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="Phone"
                className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min="1"
                  value={form.items}
                  onChange={(e) => setForm((f) => ({ ...f, items: Number(e.target.value) }))}
                  placeholder="Items"
                  className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white"
                />
                <input
                  type="number"
                  min="0"
                  value={form.total}
                  onChange={(e) => setForm((f) => ({ ...f, total: Number(e.target.value) }))}
                  placeholder="Total (MAD)"
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
