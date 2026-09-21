import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { ShoppingCart, Users, Clock, TrendingUp } from 'lucide-react';
import { useOrders } from '../../contexts/OrdersContext';
import { useReservations } from '../../contexts/ReservationsContext';
import { useProducts } from '../../contexts/ProductsContext';
import { formatPrice } from '../../lib/utils';

const COLORS = ['#ff5f0f', '#edc965', '#c81d31', '#10b981', '#3b82f6'];

export default function AnalyticsPage() {
  const { orders } = useOrders();
  const { reservations } = useReservations();
  const { products } = useProducts();

  const statusData = [
    { name: 'Pending', value: orders.filter((o) => o.status === 'pending').length },
    { name: 'Preparing', value: orders.filter((o) => o.status === 'preparing').length },
    { name: 'Ready', value: orders.filter((o) => o.status === 'ready').length },
    { name: 'Delivered', value: orders.filter((o) => o.status === 'delivered').length },
    { name: 'Cancelled', value: orders.filter((o) => o.status === 'cancelled').length },
  ].filter((d) => d.value > 0);

  const reservationData = [
    { name: 'Confirmed', value: reservations.filter((r) => r.status === 'confirmed').length },
    { name: 'Pending', value: reservations.filter((r) => r.status === 'pending').length },
    { name: 'Seated', value: reservations.filter((r) => r.status === 'seated').length },
    { name: 'Completed', value: reservations.filter((r) => r.status === 'completed').length },
  ].filter((d) => d.value > 0);

  const categoryData = products.reduce((acc: { name: string; value: number }[], p) => {
    const existing = acc.find((c) => c.name === p.categoryId);
    if (existing) existing.value += 1;
    else acc.push({ name: p.categoryId, value: 1 });
    return acc;
  }, []);

  const weeklyData = [
    { day: 'Mon', orders: 12, revenue: 850 },
    { day: 'Tue', orders: 18, revenue: 1200 },
    { day: 'Wed', orders: 15, revenue: 1050 },
    { day: 'Thu', orders: 22, revenue: 1580 },
    { day: 'Fri', orders: 28, revenue: 2100 },
    { day: 'Sat', orders: 35, revenue: 2650 },
    { day: 'Sun', orders: 24, revenue: 1820 },
  ];

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-ember-400' },
    { label: 'Reservations', value: reservations.length, icon: Clock, color: 'text-gold-400' },
    { label: 'Products', value: products.length, icon: Users, color: 'text-sky-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-white/50 text-sm mt-1">Performance insights</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-charcoal-900/60 border border-white/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50">{s.label}</span>
              <s.icon className={'w-4 h-4 ' + s.color} />
            </div>
            <p className="text-xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-5">
          <h2 className="font-bold mb-4">Orders by Status</h2>
          <div className="h-64">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(10,10,15,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-white/30 text-sm">No data</div>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-5">
          <h2 className="font-bold mb-4">Reservation Status</h2>
          <div className="h-64">
            {reservationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={reservationData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                    {reservationData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(10,10,15,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-white/30 text-sm">No data</div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-5">
        <h2 className="font-bold mb-4">Weekly Table Trend</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={12} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(10,10,15,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
              <Bar dataKey="orders" fill="#ff5f0f" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-5">
        <h2 className="font-bold mb-4">Products by Category</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} width={80} />
              <Tooltip contentStyle={{ background: 'rgba(10,10,15,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
              <Bar dataKey="value" fill="#edc965" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
