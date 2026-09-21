import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, CalendarClock, ArrowLeft, Flame, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const items = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/orders', icon: ClipboardList, label: 'Orders' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/reservations', icon: CalendarClock, label: 'Reservations' },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-64 h-full bg-charcoal-900 border-r border-white/10 flex flex-col">
      <div className="h-16 flex items-center gap-3 px-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-2xl bg-flame-gradient flex items-center justify-center">
          <Flame className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold leading-none text-sm">Admin Panel</p>
          <p className="text-[10px] text-white/50 mt-1">emynfc</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition',
                isActive ? 'bg-flame-gradient text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
              )
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1">
        <Link to="/" className="flex items-center gap-2 px-3 py-2.5 rounded-2xl text-sm text-white/60 hover:bg-white/5 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </Link>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-2xl text-sm text-crimson-400 hover:bg-crimson-500/10 transition"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
