import { NavLink } from 'react-router-dom';
import { Home, UtensilsCrossed, Gamepad2, ShoppingBag, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';

export function MobileBottomNav() {
  const { count } = useCart();
  const { t } = useLanguage();

  const items = [
    { to: '/', icon: Home, label: t('nav.home') },
    { to: '/menu', icon: UtensilsCrossed, label: t('nav.menu') },
    { to: '/games', icon: Gamepad2, label: t('nav.play') },
    { to: '/cart', icon: ShoppingBag, label: t('nav.cart') },
    { to: '/account', icon: User, label: t('nav.account') },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-charcoal-900/95 backdrop-blur-xl border-t border-white/10">
      <div className="grid grid-cols-5">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition relative',
                isActive ? 'text-ember-400' : 'text-white/60'
              )
            }
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {to === '/cart' && count > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-flame-gradient text-[9px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </div>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
