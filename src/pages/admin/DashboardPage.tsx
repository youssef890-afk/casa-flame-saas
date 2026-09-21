import { DollarSign, ShoppingCart, CalendarClock, Package } from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';
import { formatPrice } from '../../lib/utils';

export default function DashboardPage() {
  const { products } = useProducts();

  const stats = [
    { label: "Today's Revenue", value: 4250, icon: DollarSign, color: 'from-ember-500/20 to-ember-500/0', text: 'text-ember-400', money: true },
    { label: "Today's Orders", value: 28, icon: ShoppingCart, color: 'from-gold-500/20 to-gold-500/0', text: 'text-gold-400', money: false },
    { label: "Reservations", value: 12, icon: CalendarClock, color: 'from-crimson-500/20 to-crimson-500/0', text: 'text-crimson-400', money: false },
    { label: "Products", value: products.length, icon: Package, color: 'from-emerald-500/20 to-emerald-500/0', text: 'text-emerald-400', money: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-white/50 text-sm mt-1">Overview of your restaurant</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-3xl bg-charcoal-900/60 border border-white/5 p-5">
            <div className={'absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br blur-2xl ' + s.color} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-white/50">{s.label}</span>
                <div className={'w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 ' + s.text}>
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold">
                {s.money ? formatPrice(s.value) : s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-6">
          <h2 className="font-bold mb-4">Popular products</h2>
          <div className="space-y-3">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.image} alt="" className="w-12 h-12 rounded-2xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-white/40">{p.categoryId}</p>
                </div>
                <span className="text-sm font-bold text-ember-400">{formatPrice(p.price)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-6">
          <h2 className="font-bold mb-4">Recent activity</h2>
          <div className="space-y-3 text-sm">
            <p className="text-white/60"><span className="text-white">Order #1042</span> - Preparing - 12:24</p>
            <p className="text-white/60"><span className="text-white">Order #1041</span> - Ready - 12:15</p>
            <p className="text-white/60"><span className="text-white">Reservation</span> - 4 guests - 20:00</p>
            <p className="text-white/60"><span className="text-white">Order #1040</span> - Delivered - 12:02</p>
          </div>
        </div>
      </div>
    </div>
  );
}
