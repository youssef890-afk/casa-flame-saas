import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, ShoppingBag, UserRound, X } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { cn } from '../../lib/utils';
import { DEMO_RESTAURANT } from '../../services/demoData';

const labels = {
  en: {
    home: 'Home', menu: 'Menu', reservations: 'Reservations', account: 'Account', cart: 'Cart',
    admin: 'Admin', close: 'Close menu', open: 'Open menu', additional: 'More pages',
    terms: 'Terms of use', about: 'About us', privacy: 'Privacy policy', contact: 'Contact us',
    inquiry: 'Inquiry', language: 'Language',
  },
  fr: {
    home: 'Accueil', menu: 'Menu', reservations: 'Réservations', account: 'Compte', cart: 'Panier',
    admin: 'Admin', close: 'Fermer le menu', open: 'Ouvrir le menu', additional: 'Pages supplémentaires',
    terms: 'Conditions d’utilisation', about: 'À propos', privacy: 'Confidentialité', contact: 'Contact',
    inquiry: 'Question', language: 'Langue',
  },
  ar: {
    home: 'الرئيسية', menu: 'القائمة', reservations: 'الحجوزات', account: 'حسابي', cart: 'السلة',
    admin: 'الإدارة', close: 'إغلاق القائمة', open: 'فتح القائمة', additional: 'المزيد من الصفحات',
    terms: 'اتفاقية الاستخدام', about: 'من نحن', privacy: 'سياسة الاستخدام والخصوصية',
    contact: 'اتصل بنا', inquiry: 'استفسار', language: 'اللغة',
  },
};

const languageNames = { ar: 'العربية', fr: 'Français', en: 'English' };

export function Navbar() {
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wideLayout, setWideLayout] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const menuRootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { count } = useCart();
  const { isAdmin } = useAdminAuth();
  const { locale, dir, setLocale } = useLanguage();
  const location = useLocation();
  const text = labels[locale];

  useEffect(() => setMobile(false), [location.pathname, location.search]);

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 8);
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const updateLayout = () => setWideLayout(media.matches);
    media.addEventListener('change', updateLayout);
    return () => media.removeEventListener('change', updateLayout);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobile]);

  useEffect(() => {
    if (!mobile) return;

    const getVisibleItems = () => [...(menuRootRef.current?.querySelectorAll<HTMLElement>(
      '#additional-navigation a[href], #additional-navigation button:not(:disabled)'
    ) ?? [])].filter((element) => element.getClientRects().length > 0);

    const focusFrame = window.requestAnimationFrame(() => getVisibleItems()[0]?.focus());
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!menuRootRef.current?.contains(event.target as Node)) setMobile(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMobile(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;
      if (wideLayout) return;
      const items = getVisibleItems();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobile, wideLayout]);

  const mainLinks = [
    { to: '/', label: text.home, end: true },
    { to: '/menu', label: text.menu },
    { to: '/reservations', label: text.reservations },
  ];
  const additionalLinks = [
    { to: '/terms', label: text.terms },
    { to: '/about', label: text.about },
    { to: '/privacy', label: text.privacy },
    { to: '/contact', label: text.contact },
    { to: '/inquiry', label: text.inquiry },
  ];

  const languageSwitch = (
    <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 p-1" aria-label={text.language}>
      {(['ar', 'fr', 'en'] as const).map((language) => (
        <button
          key={language}
          type="button"
          onClick={() => setLocale(language)}
          lang={language}
          aria-pressed={locale === language}
          className={cn(
            'rounded-lg px-2 py-1 text-[11px] font-semibold sm:text-xs',
            locale === language ? 'bg-ember-600 text-white' : 'text-white/80 hover:bg-white/10'
          )}
        >
          {languageNames[language]}
        </button>
      ))}
    </div>
  );

  return (
    <div ref={menuRootRef} dir={dir} className={cn(
      'sticky top-0 z-50 border-b border-white/10 text-white shadow-[0_8px_24px_rgba(0,0,0,.18)] backdrop-blur-xl transition-colors duration-200',
      scrolled ? 'bg-charcoal-950/95' : 'bg-charcoal-950/90'
    )}>
      <header>
        <div className="container-app flex h-16 items-center justify-between gap-2 sm:h-20 sm:gap-4">
          <div className="flex shrink-0 items-center gap-2">
            <Link to="/" className="flex shrink-0 items-center" aria-label={DEMO_RESTAURANT.name}>
              <img src="/happy-eating-logo.png" alt={DEMO_RESTAURANT.name} width="48" height="56" className="h-12 w-auto object-contain sm:h-14" />
            </Link>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMobile((open) => !open)}
              aria-label={mobile ? text.close : text.open}
              aria-expanded={mobile}
              aria-controls="additional-navigation"
              className="rounded-xl p-2 text-white/90 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember-300"
            >
              {mobile ? <X className="h-5 w-5" aria-hidden="true" /> : <MenuIcon className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>

          <nav className="hidden items-center gap-2 lg:flex" aria-label="Main navigation">
            {mainLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => cn(
                  'inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'
                )}
              >
                {link.label}
              </NavLink>
            ))}
            {isAdmin && <Link to="/admin" className="rounded-xl px-3 py-2 text-sm font-semibold text-ember-300 hover:bg-white/5">{text.admin}</Link>}
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <div className="hidden sm:block">{languageSwitch}</div>
            <Link to="/cart" className="relative rounded-xl p-2 text-white/90 hover:bg-white/10" aria-label={`${text.cart}${count ? ` (${count})` : ''}`} title={text.cart}>
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {count > 0 && <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-flame-gradient px-1 text-[10px] font-bold text-white">{count}</span>}
            </Link>
            <Link to="/account" className="rounded-xl p-2 text-white/90 hover:bg-white/10" aria-label={text.account} title={text.account}>
              <UserRound className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      {mobile && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 lg:absolute lg:inset-x-0 lg:top-full lg:h-0 lg:bg-transparent"
          onClick={(event) => {
            if (event.target === event.currentTarget) setMobile(false);
          }}
        >
          <div
            id="additional-navigation"
            role={wideLayout ? undefined : 'dialog'}
            aria-modal={wideLayout ? undefined : true}
            aria-label={text.additional}
            className="menu-panel absolute inset-y-0 start-0 flex w-80 max-w-[88vw] flex-col gap-2 overflow-y-auto border-e border-white/10 bg-charcoal-900 p-6 shadow-2xl lg:absolute lg:inset-y-auto lg:start-4 lg:top-2 lg:max-w-[calc(100vw-2rem)] lg:rounded-2xl lg:border lg:border-white/10"
          >
            <nav aria-label="Main navigation" className="flex flex-col gap-2 lg:hidden">
              {mainLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => cn(
                    'rounded-xl px-4 py-3 font-medium transition-colors',
                    isActive ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10'
                  )}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <hr className="my-2 border-white/10 lg:hidden" />
            <nav aria-label={text.additional} className="flex flex-col gap-2">
              {additionalLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => cn(
                    'rounded-xl px-4 py-3 font-medium transition-colors',
                    isActive ? 'bg-ember-600 text-white' : 'text-white/85 hover:bg-white/10'
                  )}
                >
                  {link.label}
                </NavLink>
              ))}
              {isAdmin && <Link to="/admin" className="rounded-xl px-4 py-3 font-semibold text-ember-300 hover:bg-white/10">{text.admin}</Link>}
            </nav>
            <div className="mt-4 sm:hidden">{languageSwitch}</div>
          </div>
        </div>
      )}
    </div>
  );
}
