import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customer: string;
  phone: string;
  items: number;
  total: number;
  status: OrderStatus;
  time: string;
  table?: string;
  notes?: string;
  createdAt: number;
}

const KEY = 'casa_orders_v1';

const DEFAULT_ORDERS: Order[] = [
  { id: '#1042', customer: 'Youssef B.', phone: '+212 661 111 111', items: 3, total: 195, status: 'preparing', time: '12:24', table: 'T-04', createdAt: Date.now() - 60000 },
  { id: '#1041', customer: 'Salma R.', phone: '+212 662 222 222', items: 2, total: 130, status: 'ready', time: '12:15', table: 'T-09', createdAt: Date.now() - 120000 },
  { id: '#1040', customer: 'Karim A.', phone: '+212 663 333 333', items: 5, total: 320, status: 'delivered', time: '12:02', createdAt: Date.now() - 180000 },
  { id: '#1039', customer: 'Lina M.', phone: '+212 664 444 444', items: 1, total: 65, status: 'pending', time: '11:58', table: 'T-12', createdAt: Date.now() - 240000 },
  { id: '#1038', customer: 'Omar T.', phone: '+212 665 555 555', items: 4, total: 240, status: 'delivered', time: '11:42', createdAt: Date.now() - 300000 },
];

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_ORDERS;
}

function saveOrders(orders: Order[]) {
  try { localStorage.setItem(KEY, JSON.stringify(orders)); } catch {}
}

interface OrdersContextValue {
  orders: Order[];
  addOrder: (order: Omit<Order, 'createdAt'>) => void;
  updateOrder: (id: string, patch: Partial<Order>) => void;
  updateStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
  stats: {
    todayCount: number;
    todayRevenue: number;
    pending: number;
    preparing: number;
    ready: number;
  };
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => loadOrders());

  useEffect(() => { saveOrders(orders); }, [orders]);

  const addOrder = (order: Omit<Order, 'createdAt'>) => {
    setOrders((prev) => [{ ...order, createdAt: Date.now() }, ...prev]);
  };

  const updateOrder = (id: string, patch: Partial<Order>) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  };

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const stats = {
    todayCount: orders.length,
    todayRevenue: orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
    pending: orders.filter((o) => o.status === 'pending').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateOrder, updateStatus, deleteOrder, stats }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}
