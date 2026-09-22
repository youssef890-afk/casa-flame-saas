import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, ShoppingBag, User, X, ArrowLeft, Flame, Shield, FileText } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { cn } from '../../lib/utils';
import { DEMO_RESTAURANT } from '../../services/demoData';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobile(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobile]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/reservations', label: 'Reservations' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled || !isHome
            ? 'bg-charcoal-950/95 backdrop-blur-xl border-b border-white/10'
            : 'bg-gradient-to-b from-charcoal-950/80 to-transparent'
        )}
      >
        <div className="container-app flex items-center justify-between h-16 sm:h-20 gap-3">
          <button
            onClick={() => (isHome ? setMobile(true) : navigate(-1))}
            className="md:hidden p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white shrink-0"
            aria-label="Navigation"
          >
            {isHome ? <MenuIcon className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-3 sm:gap-4 shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-flame-gradient blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-flame-gradient flex items-center justify-center border-2 border-white/20 shadow-lg">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow" strokeWidth={2.5} />
              </div>
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-ember-300 bg-clip-text text-transparent">
                emynfc
              </span>
              <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.2em] text-ember-400/90 mt-1">
                RESTAURANT
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition',
                    isActive ? 'text-white bg-white/5' : 'text-white/70 hover:text-white hover:bg-white/5'
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <NavLink
              to="/protocol"
              className={({ isActive }) =>
                cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2',
                  isActive ? 'text-white bg-white/5' : 'text-white/70 hover:text-white hover:bg-white/5'
                )
              }
            >
              <FileText className="w-4 h-4" />
              Protocol
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/account"
              className="hidden sm:inline-flex p-2.5 rounded-2xl hover:bg-white/5 transition text-white/80"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            <Link
              to="/cart"
              className="relative p-2.5 rounded-2xl hover:bg-white/5 transition text-white/80"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-flame-gradient text-[10px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            <Link
              to="/admin/login"
              className="hidden md:inline-flex items-center gap-2 h-10 px-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-white/80 text-sm font-semibold"
            >
              <Shield className="w-4 h-4 text-ember-400" />
              Admin
            </Link>

            <button
              onClick={() => setMobile(true)}
              className="hidden md:inline-flex p-2.5 rounded-2xl hover:bg-white/5 transition text-white/80"
              aria-label="Open menu"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {mobile && (
        <div className="fixed inset-0 z-[999] md:hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobile(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85%] bg-charcoal-900 p-6 flex flex-col border-r border-white/10 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-flame-gradient flex items-center justify-center border-2 border-white/20 shadow-lg">
                  <Flame className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-extrabold tracking-tight">emynfc</span>
                  <span className="text-[9px] tracking-[0.2em] text-ember-400/90 mt-1">RESTAURANT</span>
                </div>
              </div>
              <button
                onClick={() => setMobile(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setMobile(false)}
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-3 rounded-2xl text-base font-medium transition',
                      isActive ? 'bg-flame-gradient text-white' : 'text-white/80 hover:bg-white/5'
                    )
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <NavLink
                to="/protocol"
                onClick={() => setMobile(false)}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-3 rounded-2xl text-base font-medium transition flex items-center gap-3',
                    isActive ? 'bg-flame-gradient text-white' : 'text-white/80 hover:bg-white/5'
                  )
                }
              >
                <FileText className="w-4 h-4" />
                Protocol
              </NavLink>
              <NavLink
                to="/account"
                onClick={() => setMobile(false)}
                className="px-4 py-3 rounded-2xl text-white/80 hover:bg-white/5 transition"
              >
                Account
              </NavLink>
              <NavLink
                to="/cart"
                onClick={() => setMobile(false)}
                className="px-4 py-3 rounded-2xl text-white/80 hover:bg-white/5 transition"
              >
                Cart ({count})
              </NavLink>
            </nav>

            {/* Admin section */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Restaurant Owner</p>
              <Link
                to="/admin/login"
                onClick={() => setMobile(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-ember-500/10 border border-ember-500/30 text-white hover:bg-ember-500/20 transition"
              >
                <div className="w-10 h-10 rounded-2xl bg-flame-gradient flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">Admin Login</p>
                  <p className="text-[10px] text-white/50">Manage your restaurant</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
