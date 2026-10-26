import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronDown, MessageCircle, Star } from 'lucide-react';
import { CATEGORIES, DEMO_RESTAURANT } from '../../services/demoData';
import { useProducts } from '../../contexts/ProductsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ProductCard } from '../../components/product/ProductCard';
import { ProgressiveImage } from '../../components/ui/ProgressiveImage';
import { cn } from '../../lib/utils';

function getHeroImageSource(source: string) {
  try {
    const imageUrl = new URL(source);
    if (imageUrl.hostname === 'images.unsplash.com') {
      imageUrl.searchParams.set('auto', 'format');
      imageUrl.searchParams.set('fit', 'crop');
      imageUrl.searchParams.set('w', '1100');
      imageUrl.searchParams.set('q', '85');
      imageUrl.searchParams.set('fm', 'webp');
      return imageUrl.toString();
    }
  } catch {
    return source;
  }
  return source;
}

function isRestaurantOpen(now: Date) {
  const { open, close, timeZone } = DEMO_RESTAURANT.openingHours;
  const localTime = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const currentMinutes = Number(localTime.find((part) => part.type === 'hour')?.value) * 60
    + Number(localTime.find((part) => part.type === 'minute')?.value);
  const [openHour, openMinute] = open.split(':').map(Number);
  const [closeHour, closeMinute] = close.split(':').map(Number);
  const openAt = openHour * 60 + openMinute;
  const closeAt = closeHour * 60 + closeMinute;

  return openAt < closeAt
    ? currentMinutes >= openAt && currentMinutes < closeAt
    : currentMinutes >= openAt || currentMinutes < closeAt;
}

const copy = {
  en: {
    description: 'Find Happy Eating Snack in Agadir, browse the menu, or get in touch with us.',
    menu: 'View Menu', reserve: 'Reserve Table', whatsapp: 'WhatsApp',
    imageFallback: 'Our featured dish',
    openNow: 'Open now', closedNow: 'Closed now',
    categories: 'Browse by Category', popular: 'Most ordered', ratings: 'Top-rated dishes',
    gallery: 'Fresh from our kitchen',
    dishes: 'dishes', scroll: 'Browse by category',
    ratingNote: 'Ratings shown are from our current menu data.',
  },
  fr: {
    description: 'Retrouvez Happy Eating Snack à Agadir, consultez le menu ou contactez-nous.',
    menu: 'Voir le menu', reserve: 'Réserver une table', whatsapp: 'WhatsApp',
    imageFallback: 'Notre plat vedette',
    openNow: 'Ouvert maintenant', closedNow: 'Fermé maintenant',
    categories: 'Parcourir par catégorie', popular: 'Les plus commandés', ratings: 'Plats les mieux notés',
    gallery: 'Tout droit de notre cuisine',
    dishes: 'plats', scroll: 'Parcourir par catégorie',
    ratingNote: 'Notes issues des données actuelles de notre menu.',
  },
  ar: {
    description: <>زوروا <bdi dir="ltr">Happy Eating Snack</bdi> في أكادير، تصفحوا القائمة أو تواصلوا معنا.</>,
    menu: 'تصفح القائمة', reserve: 'احجز طاولة', whatsapp: 'واتساب',
    imageFallback: 'طبقنا المميز',
    openNow: 'مفتوح الآن', closedNow: 'مغلق الآن',
    categories: 'تصفح حسب الفئة', popular: 'الأكثر طلباً', ratings: 'الأطباق الأعلى تقييماً',
    gallery: 'من مطبخنا مباشرة',
    dishes: 'أطباق', scroll: 'تصفح حسب الفئة',
    ratingNote: 'التقييمات المعروضة من بيانات القائمة الحالية.',
  },
};

export default function HomePage() {
  const { products, categories } = useProducts();
  const { locale, dir } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const [restaurantOpen, setRestaurantOpen] = useState(() => isRestaurantOpen(new Date()));
  const text = copy[locale];
  const featured = products.filter((product) => product.popular).slice(0, 4);
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const heroProduct = products.find((product) => product.categoryId === 'burgers' && product.popular)
    ?? products.find((product) => product.categoryId === 'burgers')
    ?? featured[0]
    ?? topRated[0];
  const heroImage = getHeroImageSource(heroProduct?.image ?? DEMO_RESTAURANT.heroImage);
  useEffect(() => setHeroImageFailed(false), [heroProduct?.id, heroImage]);
  useEffect(() => {
    const updateOpenState = () => setRestaurantOpen(isRestaurantOpen(new Date()));
    const interval = window.setInterval(updateOpenState, 60_000);
    return () => window.clearInterval(interval);
  }, []);
  const orderedCategories = [...categories].sort((a, b) => {
    const popularA = products.filter((product) => product.categoryId === a.id && product.popular).length;
    const popularB = products.filter((product) => product.categoryId === b.id && product.popular).length;
    return popularB - popularA || CATEGORIES.findIndex((category) => category.id === a.id) - CATEGORIES.findIndex((category) => category.id === b.id);
  });
  const waLink = `https://wa.me/${DEMO_RESTAURANT.whatsapp.replace(/\D/g, '')}`;
  const reveal = reduceMotion ? {} : { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 } };

  return (
    <div dir={dir}>
      <section className="relative flex min-h-[90vh] min-h-[90svh] items-center overflow-hidden bg-charcoal-950 pb-14 sm:pb-16">
        <ProgressiveImage
          src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80"
          alt=""
          width="1920"
          height="1080"
          loading="eager"
          decoding="async"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 backdrop-blur-sm bg-gradient-to-l from-charcoal-950/95 via-charcoal-950/80 to-charcoal-950/40" />

        <motion.div {...reveal} className="container-app relative grid items-center gap-8 py-14 text-center lg:grid-cols-[1.1fr_.9fr] lg:gap-12 lg:py-20 lg:text-start">
          <div className="order-2 lg:order-1">
            <div className="mb-4 flex justify-center lg:justify-start" aria-live="polite">
              <span className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold',
                restaurantOpen ? 'border-emerald-400/40 bg-emerald-950/70 text-emerald-100' : 'border-white/20 bg-charcoal-950/80 text-white/90'
              )}>
                <span className={cn('h-2 w-2 rounded-full', restaurantOpen ? 'animate-pulse bg-emerald-400' : 'bg-white/50')} aria-hidden="true" />
                {restaurantOpen ? text.openNow : text.closedNow}
              </span>
            </div>
            <h1 className={cn('font-display mx-auto mb-5 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:mx-0 lg:text-6xl', locale === 'ar' && 'font-cairo')}>
              {locale === 'ar' ? <>طعام لذيذ، <span className="gradient-text">وأوقات لا تُنسى</span></> : locale === 'fr' ? <>De bons plats, <span className="gradient-text">de beaux moments</span></> : <>Good food, <span className="gradient-text">happy moments</span></>}
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg lg:mx-0">
              {text.description}
            </p>

            <div dir={dir} className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap lg:justify-start">
              <Link to="/menu" dir={dir} className="hero-cta inline-flex h-[52px] min-h-[52px] w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-flame-gradient px-5 py-0 font-bold text-white sm:w-auto sm:px-6">
                <bdi>{text.menu}</bdi>
                {dir === 'rtl' ? <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" /> : <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />}
              </Link>
              <Link to="/reservations" dir={dir} className="hero-cta inline-flex h-[52px] min-h-[52px] w-full shrink-0 items-center justify-center whitespace-nowrap rounded-2xl border border-white/30 bg-charcoal-950/60 px-5 py-0 font-semibold text-white backdrop-blur sm:w-auto sm:px-6">
                <bdi>{text.reserve}</bdi>
              </Link>
              <a href={waLink} target="_blank" rel="noopener noreferrer" dir={dir} className="hero-cta inline-flex h-[52px] min-h-[52px] w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-emerald-400/60 bg-charcoal-950/70 px-5 py-0 font-semibold text-white backdrop-blur sm:w-auto sm:px-6">
                <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                <bdi>{text.whatsapp}</bdi>
              </a>
            </div>
          </div>

          <div className={cn('hero-food-float order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none', reduceMotion && 'motion-reduce:animate-none')}>
            <div className="relative mx-auto h-60 w-full overflow-hidden rounded-3xl border border-ember-300/50 bg-gradient-to-br from-ember-500/30 via-charcoal-800 to-charcoal-950 shadow-[0_20px_70px_rgba(0,0,0,.5),0_0_32px_rgba(255,128,55,.14)] lg:h-auto lg:aspect-[4/3] lg:w-[min(36vw,34rem)]">
              {!heroImageFailed ? (
                <ProgressiveImage
                  src={heroImage}
                  alt={locale === 'ar' ? 'طبق مميز طازج من Happy Eating Snack في أكادير' : locale === 'fr' ? 'Plat vedette fraîchement préparé chez Happy Eating Snack à Agadir' : 'A freshly prepared signature dish from Happy Eating Snack in Agadir'}
                  width="1100"
                  height="825"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 42vw"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                  onError={() => setHeroImageFailed(true)}
                  className="hero-food-image absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div role="img" aria-label={text.imageFallback} className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,rgba(255,128,55,.4),transparent_58%),linear-gradient(135deg,#29201c,#111116_72%)] p-8 text-center">
                  <span className="font-display text-2xl font-bold text-white sm:text-3xl">{text.imageFallback}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <a href="#categories" aria-label={text.scroll} className="absolute inset-x-0 bottom-5 mx-auto flex w-fit scroll-smooth flex-col items-center gap-1 text-sm font-medium text-white hover:text-white">
          <span>{text.categories}</span>
          <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden="true" />
        </a>
      </section>

      <motion.section id="categories" {...reveal} className="container-app py-16 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <h2 className="heading-lg">{text.categories}</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {orderedCategories.map((category) => {
            const itemCount = products.filter((product) => product.categoryId === category.id).length;
            const name = locale === 'ar' ? category.nameAr : locale === 'fr' ? category.nameFr : category.name;
            return (
              <Link
                key={category.id}
                to={`/menu?category=${encodeURIComponent(category.id)}`}
                className="category-tile group relative aspect-square overflow-hidden rounded-3xl border border-white/15 bg-charcoal-900 transition-[border-color,box-shadow] duration-200 hover:border-ember-400/80 hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember-300"
              >
                <ProgressiveImage
                  src={category.image.replace('?w=600&q=80', '?auto=format&fit=crop&w=720&q=80')}
                  alt={name}
                  width="720"
                  height="720"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-start">
                  <h3 className="line-clamp-2 text-lg font-bold text-white sm:text-xl">{name}</h3>
                  <p className="mt-1 text-sm font-medium text-white/85">{itemCount} {text.dishes}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.section>

      {featured.length > 0 && (
        <motion.section {...reveal} className="container-app py-12 sm:py-16">
          <h2 className="heading-lg mb-8">{text.popular}</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </motion.section>
      )}

      {topRated.length > 0 && (
        <motion.section {...reveal} className="bg-charcoal-900/55 py-16 sm:py-20">
          <div className="container-app">
            <h2 className="heading-lg mb-3">{text.ratings}</h2>
            <p className="mb-8 text-sm text-white/75">{text.ratingNote}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {topRated.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-charcoal-950/70 p-4 hover:border-ember-400/50">
                  <ProgressiveImage src={product.image.replace('?w=800&q=80', '?auto=format&fit=crop&w=240&q=75')} alt={product.name} width="72" height="72" loading="lazy" decoding="async" className="h-18 w-18 rounded-xl object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block line-clamp-2 font-semibold text-white">{product.name}</span>
                    <span className="mt-1 flex items-center gap-1 text-sm text-white/85"><Star className="h-4 w-4 fill-gold-400 text-gold-400" aria-hidden="true" />{product.rating.toFixed(1)}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      <motion.section {...reveal} className="container-app py-16 sm:py-20">
        <h2 className="heading-lg mb-8">{text.gallery}</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {products.slice(0, 6).map((product) => (
            <ProgressiveImage
              key={product.id}
              src={product.image.replace('?w=800&q=80', '?auto=format&fit=crop&w=720&q=75')}
              alt={product.name}
              width="720"
              height="540"
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      </motion.section>
    </div>
  );
}
