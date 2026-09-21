import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, CalendarClock, ArrowLeft, Flame, LogOut, HardDrive } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const items = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/orders', icon: ClipboardList, label: 'Orders' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/reservations', icon: CalendarClock, label: 'Bookings' },
  { to: '/admin/backup', icon: HardDrive, label: 'Backup' },
];

export default function AdminLayout() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-charcoal-950 pb-20 md:pb-0">
      <header className="sticky top-0 z-30 bg-charcoal-900/95 backdrop-blur-xl border-b border-white/10 h-16 flex items-center px-4">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-flame-gradient flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-none">Admin</p>
            <p className="text-[10px] text-white/50 mt-1">emynfc</p>
          </div>
        </Link>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="ml-auto p-2 rounded-xl hover:bg-white/5 text-crimson-400"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <div className="hidden md:flex">
        <aside className="fixed left-0 top-16 bottom-0 w-60 bg-charcoal-900 border-r border-white/10 p-3 space-y-1 overflow-y-auto">
          {items.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
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
          <Link to="/" className="flex items-center gap-2 px-3 py-2.5 rounded-2xl text-sm text-white/60 hover:bg-white/5 transition mt-4">
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </Link>
        </aside>
        <div className="ml-60 flex-1 p-6 lg:p-8">
          <Outlet />
        </div>
      </div>

      <div className="md:hidden p-4">
        <Outlet />
      </div>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-charcoal-900/95 backdrop-blur-xl border-t border-white/10">
        <div className="grid grid-cols-5">
          {items.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition',
                  isActive ? 'text-ember-400' : 'text-white/60'
                )
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
