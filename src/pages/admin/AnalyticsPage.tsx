import { useMemo, useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line,
} from 'recharts';
import { ShoppingCart, Users, Clock, TrendingUp } from 'lucide-react';
import { useOrders } from '../../contexts/OrdersContext';
import { useReservations } from '../../contexts/ReservationsContext';
import { useProducts } from '../../contexts/ProductsContext';
import { formatPrice, cn } from '../../lib/utils';

const COLORS = ['#ff5f0f', '#edc965', '#c81d31', '#10b981', '#3b82f6'];

type Period = 'today' | 'week' | 'month' | 'year' | 'all';

const periodLabels: Record<Period, string> = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
  year: 'This Year',
  all: 'All Time',
};

function getStartDate(period: Period): Date {
  const now = new Date();
  const start = new Date(now);
  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(now.getDate() - 7);
      break;
    case 'month':
      start.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      start.setFullYear(now.getFullYear() - 1);
      break;
    case 'all':
      start.setFullYear(2000);
      break;
  }
  return start;
}

export default function AnalyticsPage() {
  const { orders } = useOrders();
  const { reservations } = useReservations();
  const { products } = useProducts();
  const [period, setPeriod] = useState<Period>('week');

  const startDate = useMemo(() => getStartDate(period), [period]);

  const filteredOrders = useMemo(
    () => orders.filter((o) => new Date(o.createdAt) >= startDate),
    [orders, startDate]
  );

  const filteredReservations = useMemo(
    () => reservations.filter((r) => new Date(r.createdAt) >= startDate),
    [reservations, startDate]
  );

  const statusData = useMemo(() => {
    return [
      { name: 'Pending', value: filteredOrders.filter((o) => o.status === 'pending').length },
      { name: 'Preparing', value: filteredOrders.filter((o) => o.status === 'preparing').length },
      { name: 'Ready', value: filteredOrders.filter((o) => o.status === 'ready').length },
      { name: 'Delivered', value: filteredOrders.filter((o) => o.status === 'delivered').length },
      { name: 'Cancelled', value: filteredOrders.filter((o) => o.status === 'cancelled').length },
    ].filter((d) => d.value > 0);
  }, [filteredOrders]);

  const reservationData = useMemo(() => {
    return [
      { name: 'Confirmed', value: filteredReservations.filter((r) => r.status === 'confirmed').length },
      { name: 'Pending', value: filteredReservations.filter((r) => r.status === 'pending').length },
      { name: 'Seated', value: filteredReservations.filter((r) => r.status === 'seated').length },
      { name: 'Completed', value: filteredReservations.filter((r) => r.status === 'completed').length },
      { name: 'Cancelled', value: filteredReservations.filter((r) => r.status === 'cancelled').length },
    ].filter((d) => d.value > 0);
  }, [filteredReservations]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [products]);

  const timeData = useMemo(() => {
    const buckets: Record<string, { orders: number; revenue: number }> = {};

    filteredOrders.forEach((o) => {
      const d = new Date(o.createdAt);
      let key: string;
      if (period === 'today') {
        key = d.getHours().toString().padStart(2, '0') + ':00';
      } else if (period === 'week' || period === 'month') {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        key = days[d.getDay()];
      } else {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        key = months[d.getMonth()];
      }
      if (!buckets[key]) buckets[key] = { orders: 0, revenue: 0 };
      buckets[key].orders += 1;
      buckets[key].revenue += o.total;
    });

    return Object.entries(buckets).map(([name, data]) => ({
      name,
      orders: data.orders,
      revenue: data.revenue,
    }));
  }, [filteredOrders, period]);

  const totalRevenue = filteredOrders.reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Total Orders', value: filteredOrders.length, icon: ShoppingCart, color: 'text-ember-400' },
    { label: 'Reservations', value: filteredReservations.length, icon: Clock, color: 'text-gold-400' },
    { label: 'Products', value: products.length, icon: Users, color: 'text-sky-400' },
  ];

  const hasOrders = filteredOrders.length > 0;
  const hasReservations = filteredReservations.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-white/50 text-sm mt-1">Performance insights</p>
      </div>

      {/* Period Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(Object.keys(periodLabels) as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              'shrink-0 px-4 py-2 rounded-2xl text-sm font-medium border transition',
              period === p
                ? 'bg-flame-gradient border-transparent text-white'
                : 'bg-white/5 border-white/10 text-white/70'
            )}
          >
            {periodLabels[p]}
          </button>
        ))}
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

      {!hasOrders && !hasReservations && (
        <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-10 text-center">
          <p className="font-medium">No data for {periodLabels[period]}</p>
          <p className="text-sm text-white/40 mt-1">
            Create an order or reservation to see analytics.
          </p>
        </div>
      )}

      {hasOrders && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-5">
              <h2 className="font-bold mb-4">Orders by Status</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                      {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'rgba(10,10,15,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-5">
              <h2 className="font-bold mb-4">
                {period === 'today' ? 'Orders by Hour' : period === 'week' ? 'Orders by Day' : period === 'month' ? 'Orders by Day' : 'Orders by Month'}
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: 'rgba(10,10,15,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                    <Bar dataKey="orders" fill="#ff5f0f" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-5">
            <h2 className="font-bold mb-4">Revenue Trend</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(10,10,15,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} formatter={(v: any) => formatPrice(Number(v))} />
                  <Line type="monotone" dataKey="revenue" stroke="#edc965" strokeWidth={3} dot={{ fill: '#edc965', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {hasReservations && (
        <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-5">
          <h2 className="font-bold mb-4">Reservation Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={reservationData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {reservationData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(10,10,15,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {categoryData.length > 0 && (
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
      )}
    </div>
  );
}
