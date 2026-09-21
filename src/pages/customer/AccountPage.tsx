import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Package, Heart, CalendarClock, Settings, Globe, LogOut, LogIn,
  Coins, Gamepad2, Gift, ChevronRight, Check
} from 'lucide-react';
import { useCoins } from '../../contexts/CoinsContext';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProducts } from '../../contexts/ProductsContext';
import { LANGUAGES } from '../../i18n/config';
import { cn } from '../../lib/utils';

type Tab = 'profile' | 'orders' | 'favorites' | 'reservations' | 'settings';

export default function AccountPage() {
  const [tab, setTab] = useState<Tab>('profile');
  const { coins, rewards } = useCoins();
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { locale, setLocale, t } = useLanguage();
  const { products } = useProducts();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container-app py-16 max-w-md mx-auto text-center">
        <div className="w-20 h-20 rounded-3xl bg-flame-gradient flex items-center justify-center mx-auto mb-6 shadow-glow">
          <User className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-3">{t('account.hello')}</h1>
        <p className="text-white/60 mb-8 text-sm">{t('account.signInDesc')}</p>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="rounded-2xl bg-charcoal-900/60 border border-white/5 p-4">
            <Coins className="w-5 h-5 text-gold-400 mx-auto mb-2" />
            <p className="text-[10px] text-white/50">{t('account.coins')}</p>
          </div>
          <div className="rounded-2xl bg-charcoal-900/60 border border-white/5 p-4">
            <Heart className="w-5 h-5 text-crimson-400 mx-auto mb-2" />
            <p className="text-[10px] text-white/50">{t('account.favorites')}</p>
          </div>
          <div className="rounded-2xl bg-charcoal-900/60 border border-white/5 p-4">
            <Package className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-[10px] text-white/50">{t('account.orders')}</p>
          </div>
        </div>

        <Link to="/login" className="w-full h-14 rounded-2xl bg-flame-gradient text-white font-semibold flex items-center justify-center gap-2 shadow-glow mb-3">
          <LogIn className="w-5 h-5" />
          {t('action.signIn')}
        </Link>
        <Link to="/signup" className="block w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold flex items-center justify-center">
          {t('action.signUp')}
        </Link>
        <p className="text-xs text-white/40 mt-6">{t('account.guestNote')}</p>
      </div>
    );
  }

  const favProducts = products.filter((p) => favorites.includes(p.id));

  const TABS: { key: Tab; label: string; icon: any }[] = [
    { key: 'profile', label: t('account.profile'), icon: User },
    { key: 'orders', label: t('account.orders'), icon: Package },
    { key: 'favorites', label: t('account.favorites'), icon: Heart },
    { key: 'reservations', label: t('account.bookings'), icon: CalendarClock },
    { key: 'settings', label: t('account.settings'), icon: Settings },
  ];

  return (
    <div className="container-app py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-3xl bg-flame-gradient flex items-center justify-center text-2xl font-bold shadow-glow shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-bold truncate">{user.name}</h1>
          <p className="text-sm text-white/50 truncate">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-3xl bg-gradient-to-br from-ember-500/20 to-crimson-500/10 border border-ember-500/30 p-5">
          <Coins className="w-6 h-6 text-gold-400 mb-2" />
          <p className="text-3xl font-bold mb-1">{coins}</p>
          <p className="text-xs text-white/60">{t('account.coins')}</p>
        </div>
        <Link to="/games" className="rounded-3xl bg-charcoal-900/60 border border-white/5 hover:border-ember-500/30 p-5 transition flex flex-col justify-between">
          <Gamepad2 className="w-6 h-6 text-ember-400 mb-2" />
          <div>
            <p className="font-bold text-sm">{t('account.playGames')}</p>
            <p className="text-[11px] text-white/50">{t('account.earnCoins')}</p>
          </div>
        </Link>
      </div>

      <Link to="/rewards" className="block rounded-3xl bg-charcoal-900/60 border border-white/5 hover:border-gold-500/30 p-5 mb-6 transition">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-gradient flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6 text-charcoal-950" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold">{t('account.redeem')}</p>
            <p className="text-xs text-white/50 mt-0.5">{t('account.redeemDesc')}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/40" />
        </div>
      </Link>

      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-5 -mx-1 px-1">
        {TABS.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={cn(
              'shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition',
              tab === tb.key ? 'bg-flame-gradient text-white shadow-glow' : 'bg-white/5 text-white/60 hover:bg-white/10'
            )}
          >
            <tb.icon className="w-4 h-4" />
            {tb.label}
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-5">
        {tab === 'profile' && (
          <div>
            <h2 className="font-bold mb-4">{t('account.profile')}</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-white/50">{t('account.name')}</span>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-white/50">{t('account.email')}</span>
                <span className="font-medium truncate">{user.email}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-white/50">{t('account.memberSince')}</span>
                <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div>
            <h2 className="font-bold mb-4">{t('account.orders')}</h2>
            <div className="text-center py-10">
              <Package className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/50 mb-5">{t('account.noOrders')}</p>
              <Link to="/menu" className="inline-block px-5 py-2.5 rounded-2xl bg-flame-gradient text-white text-sm font-semibold">
                {t('account.browseMenu')}
              </Link>
            </div>
          </div>
        )}

        {tab === 'favorites' && (
          <div>
            <h2 className="font-bold mb-4">
              {t('account.favorites')} ({favProducts.length})
            </h2>
            {favProducts.length === 0 ? (
              <div className="text-center py-10">
                <Heart className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-white/50 mb-5">{t('account.noFavorites')}</p>
                <Link to="/menu" className="inline-block px-5 py-2.5 rounded-2xl bg-flame-gradient text-white text-sm font-semibold">
                  {t('account.browseMenu')}
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {favProducts.map((p) => (
                  <Link key={p.id} to={'/product/' + p.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition">
                    <img src={p.image} alt="" className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{p.name}</p>
                      <p className="text-xs text-ember-400 mt-0.5">{p.price.toFixed(2)} MAD</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/40" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'reservations' && (
          <div>
            <h2 className="font-bold mb-4">{t('account.bookings')}</h2>
            <div className="text-center py-10">
              <CalendarClock className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/50 mb-5">{t('account.noBookings')}</p>
              <Link to="/reservations" className="inline-block px-5 py-2.5 rounded-2xl bg-flame-gradient text-white text-sm font-semibold">
                {t('account.bookTable')}
              </Link>
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-bold mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-ember-400" />
                {t('account.language')}
              </h2>
              <div className="space-y-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLocale(l.code)}
                    className={cn(
                      'w-full flex items-center justify-between p-4 rounded-2xl border transition',
                      locale === l.code ? 'border-ember-500 bg-ember-500/10' : 'border-white/10 hover:bg-white/5'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{l.code === 'ar' ? '🇲🇦' : l.code === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
                      <div className="text-start">
                        <p className="font-medium text-sm">{l.nativeLabel}</p>
                        <p className="text-[10px] text-white/40">{l.label}</p>
                      </div>
                    </div>
                    {locale === l.code && <Check className="w-5 h-5 text-ember-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="w-full h-12 rounded-2xl bg-crimson-500/10 border border-crimson-500/25 text-crimson-400 font-semibold flex items-center justify-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                {t('action.signOut')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
