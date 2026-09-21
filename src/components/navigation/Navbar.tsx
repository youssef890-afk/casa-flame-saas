import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, ShoppingBag, User, X, ArrowLeft, Flame } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import { DEMO_RESTAURANT } from '../../services/demoData';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { count } = useCart();
  const { user } = useAuth();
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

          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-flame-gradient flex items-center justify-center shadow-glow">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="font-bold leading-none">{DEMO_RESTAURANT.name}</p>
              <p className="text-[10px] text-white/50 leading-none mt-0.5">
                {DEMO_RESTAURANT.tagline}
              </p>
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
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)' }}
            onClick={() => setMobile(false)}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '80%',
              maxWidth: '320px',
              background: '#16161d',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-flame-gradient flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">{DEMO_RESTAURANT.name}</span>
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
                to={user ? '/account' : '/login'}
                onClick={() => setMobile(false)}
                className="px-4 py-3 rounded-2xl text-white/80 hover:bg-white/5 transition"
              >
                {user ? 'Account' : 'Sign in'}
              </NavLink>
              <NavLink
                to="/cart"
                onClick={() => setMobile(false)}
                className="px-4 py-3 rounded-2xl text-white/80 hover:bg-white/5 transition"
              >
                Cart ({count})
              </NavLink>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
