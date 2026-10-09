import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock3, Flame, MapPin, MessageCircle, UtensilsCrossed, CalendarDays, Smartphone, Phone } from 'lucide-react';
import { DEMO_RESTAURANT } from '../../services/demoData';
import { useProducts } from '../../contexts/ProductsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ProductCard } from '../../components/product/ProductCard';

const copy = {
  en: {
    demo: 'Portfolio demonstration · sample dishes and business details',
    eyebrow: 'Casa Flame · Agadir region',
    headline: 'A table worth\ncoming together for.',
    intro: 'Fire-led favorites, Moroccan inspiration, and a warm welcome. Explore the menu or send a table request in just a few steps.',
    menu: 'Explore menu', reserve: 'Request a table', whatsapp: 'WhatsApp the restaurant',
    menuEyebrow: 'From the kitchen', menuTitle: 'A menu made to explore', menuMore: 'See the full menu',
    categories: 'Find your next favorite', featured: 'A first look', storyLabel: 'The Casa Flame idea', storyTitle: 'A relaxed place for food made over fire.',
    story: 'Casa Flame is a restaurant concept for a generous table: familiar favorites, Moroccan-inspired plates, and a warm welcome. This portfolio demo uses sample menu content that can be replaced with the restaurant’s verified recipes and details.',
    hours: 'Opening hours', location: 'Location', locationNote: 'Address details are for demonstration and must be verified before launch.',
    contact: 'Come by or get in touch', contactText: 'For a reservation or order inquiry, message the restaurant. Your request is not confirmed until the team replies.',
    browse: 'Browse the menu', region: 'Agadir region', menuLabel: 'Digital menu', bookingLabel: 'Table requests', mobileLabel: 'Made for mobile', call: 'Call',
  },
  fr: {
    demo: 'Démonstration portfolio · plats et informations indicatifs',
    eyebrow: 'Casa Flame · région d’Agadir',
    headline: 'Une table qui\nrassemble.',
    intro: 'Des classiques au feu, une inspiration marocaine et un accueil chaleureux. Découvrez le menu ou demandez une table en quelques étapes.',
    menu: 'Voir le menu', reserve: 'Demander une table', whatsapp: 'Écrire sur WhatsApp',
    menuEyebrow: 'À la cuisine', menuTitle: 'Un menu à découvrir', menuMore: 'Voir tout le menu',
    categories: 'Choisissez selon vos envies', featured: 'Un premier aperçu', storyLabel: 'Le concept Casa Flame', storyTitle: 'Un lieu convivial autour d’une cuisine au feu.',
    story: 'Casa Flame est un concept de restaurant pour une table généreuse : des classiques appréciés, des plats inspirés du Maroc et un accueil chaleureux. Ce portfolio utilise un menu exemple, à remplacer par les recettes et informations vérifiées du restaurant.',
    hours: 'Horaires', location: 'Adresse', locationNote: 'Les informations d’adresse sont indicatives et doivent être vérifiées avant lancement.',
    contact: 'Passez nous voir ou contactez-nous', contactText: 'Pour une réservation ou une demande, contactez le restaurant. La demande n’est confirmée qu’après réponse de l’équipe.',
    browse: 'Parcourir le menu', region: 'Région d’Agadir', menuLabel: 'Menu numérique', bookingLabel: 'Demandes de table', mobileLabel: 'Pensé pour mobile', call: 'Appeler',
  },
  ar: {
    demo: 'عرض تجريبي للأعمال · الأطباق ومعلومات المطعم نموذجية',
    eyebrow: 'Casa Flame · جهة أكادير',
    headline: 'مائدة كتجمعنا\nعلى المذاق الزوين.',
    intro: 'أطباق على النار بلمسة مغربية وترحيب دافئ. اكتشف القائمة أو طلب طاولة فخطوات بسيطة.',
    menu: 'اكتشف القائمة', reserve: 'اطلب حجز طاولة', whatsapp: 'تواصل عبر واتساب',
    menuEyebrow: 'من المطبخ', menuTitle: 'قائمة تستاهل الاكتشاف', menuMore: 'شوف القائمة كاملة',
    categories: 'اختار شنو كيشهيك', featured: 'بداية من القائمة', storyLabel: 'فكرة Casa Flame', storyTitle: 'بلاصة هانية وأطباق كتوجد على النار.',
    story: 'Casa Flame فكرة مطعم لمائدة عامرة: أطباق محبوبة، لمسات من المطبخ المغربي، وترحيب دافئ. هاد العرض فيه قائمة ومعلومات نموذجية، ويمكن تعويضها بوصفات وتفاصيل المطعم المؤكدة.',
    hours: 'أوقات العمل', location: 'الموقع', locationNote: 'العنوان المعروض تجريبي وخاصو التأكيد قبل الإطلاق.',
    contact: 'مرحبا بيك أو تواصل معانا', contactText: 'إلى بغيتي تحجز أو تسول على طلب، راسل المطعم. الطلب ما كيتأكدش حتى يجاوبك الفريق.',
    browse: 'تصفّح القائمة', region: 'جهة أكادير', menuLabel: 'قائمة رقمية', bookingLabel: 'طلب طاولة', mobileLabel: 'تجربة سهلة فالهاتف', call: 'عيط لينا',
  },
};

export default function HomePage() {
  const { products, categories } = useProducts();
  const { locale } = useLanguage();
  const text = copy[locale];
  const featured = products.slice(0, 4);
  const waNumber = DEMO_RESTAURANT.whatsapp.replace(/\D/g, '');
  const phoneNumber = DEMO_RESTAURANT.phone.replace(/[^+\d]/g, '');
  const waLink = waNumber.length >= 8 && waNumber.length <= 15
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent('Hello Casa Flame, I have a question about the menu.')}`
    : undefined;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/5 bg-charcoal-950">
        <div className="pointer-events-none absolute -right-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-ember-500/10 blur-[120px]" />
        <div className="container-app relative grid min-h-0 items-center gap-7 py-4 sm:gap-12 sm:py-20 lg:min-h-[680px] lg:grid-cols-[.9fr_1.1fr] lg:gap-16 lg:py-24">
          <div className="pointer-events-none absolute inset-x-4 top-6 h-[450px] overflow-hidden rounded-[2rem] border border-white/10 lg:hidden">
            <img src={DEMO_RESTAURANT.heroImage} alt="" aria-hidden="true" fetchPriority="high" className="h-full w-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/30 via-charcoal-950/65 to-charcoal-950" />
          </div>
          <div className="relative z-10 order-1 max-w-2xl lg:order-1">
            <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-ember-300/20 bg-ember-300/[0.07] px-4 py-2 text-xs font-medium tracking-wide text-ember-100">
              <Flame className="h-4 w-4 text-ember-300" /> {text.eyebrow}
            </div>
            <h1 className="mb-4 whitespace-pre-line text-4xl font-semibold leading-[1.12] tracking-[-0.04em] text-white sm:mb-6 sm:text-6xl lg:text-[4.5rem]">{text.headline}</h1>
            <p className="mb-5 max-w-lg text-sm leading-6 text-white/65 sm:mb-8 sm:text-lg sm:leading-8">{text.intro}</p>
            <div className="flex flex-nowrap gap-2 sm:gap-3">
              <Link to="/menu" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-ember-500 px-3 text-sm font-semibold text-white shadow-lg shadow-ember-950/30 transition hover:-translate-y-0.5 hover:bg-ember-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-300 sm:min-h-12 sm:gap-2.5 sm:px-5 sm:text-base">
                <UtensilsCrossed className="h-4 w-4" /> {text.menu} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link to="/reservations" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-white/15 px-3 text-sm font-semibold text-white/90 transition hover:border-white/30 hover:bg-white/[0.04] sm:min-h-12 sm:px-5 sm:text-base"><CalendarDays className="h-4 w-4 text-ember-300" />{text.reserve}</Link>
            </div>
            <p className="mt-6 hidden text-xs leading-5 text-white/40 sm:block">{text.demo}</p>
            <div className="mt-10 hidden max-w-xl grid-cols-3 border-t border-white/10 pt-6 sm:grid">
              <div className="pe-3"><UtensilsCrossed className="mb-3 h-4 w-4 text-ember-300" /><p className="text-xs font-medium text-white/75 sm:text-sm">{text.menuLabel}</p></div>
              <div className="border-s border-white/10 px-4"><CalendarDays className="mb-3 h-4 w-4 text-ember-300" /><p className="text-xs font-medium text-white/75 sm:text-sm">{text.bookingLabel}</p></div>
              <div className="border-s border-white/10 ps-4"><Smartphone className="mb-3 h-4 w-4 text-ember-300" /><p className="text-xs font-medium text-white/75 sm:text-sm">{text.mobileLabel}</p></div>
            </div>
          </div>
          <div className="relative order-2 hidden min-h-[470px] lg:order-2 lg:block lg:min-h-[560px]">
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/10 bg-charcoal-900 shadow-2xl shadow-black/40">
              <img src={DEMO_RESTAURANT.heroImage} alt="A warmly lit restaurant dining room" fetchPriority="high" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/5 to-charcoal-950/10" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
                <div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-ember-200">CASA FLAME</p><p className="text-xl font-semibold text-white sm:text-2xl">{text.region}</p></div>
                <span className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur"><ArrowUpRight className="h-5 w-5" /></span>
              </div>
            </div>
            <div className="absolute -bottom-5 -start-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-charcoal-900/95 p-3 shadow-xl sm:-start-6 sm:bottom-8 sm:p-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ember-500/15 text-ember-300"><MapPin className="h-5 w-5" /></span>
              <div><p className="text-[10px] font-medium uppercase tracking-wider text-white/45">{text.location}</p><p className="mt-1 text-sm font-semibold text-white">{DEMO_RESTAURANT.city}</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-app py-16 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ember-300">{text.menuEyebrow}</p><h2 className="heading-lg">{text.categories}</h2></div>
          <Link to="/menu" className="hidden items-center gap-1 text-sm font-semibold text-ember-300 hover:text-ember-200 sm:inline-flex">{text.menuMore}<ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {categories.map((category) => <Link key={category.id} to={`/menu/${category.id}`} className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-charcoal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember-400">
            <img src={category.image} alt={category.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/10 to-transparent" />
            <span className="absolute inset-x-3 bottom-3 font-semibold text-white">{locale === 'ar' ? category.nameAr : locale === 'fr' ? category.nameFr : category.name}</span>
          </Link>)}
        </div>
      </section>

      {featured.length > 0 && <section className="border-y border-white/5 bg-charcoal-900/30 py-16 sm:py-20">
        <div className="container-app">
          <div className="mb-8 flex items-end justify-between gap-4"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ember-300">{text.menuEyebrow}</p><h2 className="heading-lg">{text.featured}</h2></div><Link to="/menu" className="hidden items-center gap-1 text-sm font-semibold text-ember-300 hover:text-ember-200 sm:inline-flex">{text.menuMore}<ArrowUpRight className="h-4 w-4" /></Link></div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </div>
      </section>}

      <section id="about" className="container-app grid scroll-mt-28 gap-10 py-16 sm:py-24 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
        <div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-ember-300">{text.storyLabel}</p><h2 className="heading-lg mb-5 max-w-xl">{text.storyTitle}</h2><p className="max-w-2xl leading-8 text-white/65">{text.story}</p><Link to="/menu" className="mt-7 inline-flex items-center gap-2 font-semibold text-ember-300 hover:text-ember-200">{text.browse}<ArrowUpRight className="h-4 w-4" /></Link></div>
        <div id="location" className="grid scroll-mt-28 gap-3 rounded-3xl border border-white/10 bg-charcoal-900/50 p-6 sm:p-8">
          <div className="flex items-start gap-4 border-b border-white/10 pb-5"><Clock3 className="mt-1 h-5 w-5 shrink-0 text-ember-300" /><div><h3 className="font-semibold">{text.hours}</h3><p className="mt-1 text-sm leading-6 text-white/60">{DEMO_RESTAURANT.hours}</p></div></div>
          <div className="flex items-start gap-4 pt-2"><MapPin className="mt-1 h-5 w-5 shrink-0 text-ember-300" /><div><h3 className="font-semibold">{text.location}</h3><p className="mt-1 text-sm text-white/60">{DEMO_RESTAURANT.address}</p><p className="mt-1 text-sm text-white/60">{DEMO_RESTAURANT.city}</p><p className="mt-3 text-xs leading-5 text-amber-200/70">{text.locationNote}</p></div></div>
        </div>
      </section>

      <section id="contact" className="container-app scroll-mt-28 pb-16">
        <div className="flex flex-col justify-between gap-6 rounded-3xl border border-ember-400/20 bg-gradient-to-br from-ember-500/10 to-charcoal-900/70 p-7 sm:flex-row sm:items-center sm:p-10">
          <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-ember-300">{text.region}</p><h2 className="text-2xl font-semibold sm:text-3xl">{text.contact}</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">{text.contactText}</p></div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link to="/reservations" className="inline-flex min-h-11 items-center rounded-xl bg-ember-500 px-5 font-semibold text-white hover:bg-ember-400">{text.reserve}</Link>
            {phoneNumber.replace(/\D/g, '').length >= 8 && <a href={`tel:${phoneNumber}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-5 font-semibold text-white hover:bg-white/5"><Phone className="h-4 w-4" />{text.call}</a>}
            {waLink && <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-5 font-semibold text-white hover:bg-white/5"><MessageCircle className="h-4 w-4" />WhatsApp</a>}
          </div>
        </div>
      </section>
    </div>
  );
}

