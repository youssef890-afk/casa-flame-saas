import { Link } from 'react-router-dom';
import { Flame, MessageCircle } from 'lucide-react';
import { CATEGORIES, DEMO_RESTAURANT } from '../../services/demoData';
import { useProducts } from '../../contexts/ProductsContext';
import { ProductCard } from '../../components/product/ProductCard';

export default function HomePage() {
  const { products } = useProducts();
  const featured = products.filter((p) => p.popular).slice(0, 4);
  const showcase = products.slice(0, 3);
  const waLink = 'https://wa.me/' + DEMO_RESTAURANT.whatsapp.replace('+', '');

  return (
    <div>
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={DEMO_RESTAURANT.heroImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/85 via-charcoal-950/75 to-charcoal-950" />
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[8, 22, 38, 55, 68, 82, 92].map((left, i) => (
            <span
              key={'e' + i}
              className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-ember-400"
              style={{
                left: left + '%',
                animation: 'ember-rise ' + (4 + i * 0.5) + 's linear infinite',
                animationDelay: (i * 0.7) + 's',
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[15, 35, 55, 75].map((left, i) => (
            <span
              key={'s' + i}
              className="absolute bottom-0 w-32 h-32 rounded-full bg-white/5 blur-3xl"
              style={{
                left: left + '%',
                animation: 'smoke-rise ' + (7 + i * 1.5) + 's ease-out infinite',
                animationDelay: (i * 1.8) + 's',
              }}
            />
          ))}
        </div>

        <div className="container-app relative py-24 text-center">
          <div className="flex justify-center gap-4 sm:gap-6 mb-10">
            {showcase.map((p, i) => (
              <div
                key={p.id}
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-ember-500/50 shadow-2xl"
                style={{
                  animation: 'float-soft ' + (4 + i * 0.6) + 's ease-in-out infinite',
                  animationDelay: (i * 0.4) + 's',
                }}
              >
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ember-500/15 border border-ember-500/30 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ember-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ember-500" />
            </span>
            <span className="text-ember-300 text-xs font-semibold tracking-wider uppercase">
              Open Now - {DEMO_RESTAURANT.city}
            </span>
          </div>

          <h1 className="heading-xl mb-6 max-w-3xl mx-auto">
            Bold flavors, <span className="gradient-text">crafted with fire.</span>
          </h1>

          <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">
            {DEMO_RESTAURANT.description}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/menu"
              className="px-6 py-4 rounded-2xl bg-flame-gradient text-white font-semibold flex items-center gap-2 animate-glow"
            >
              <Flame className="w-5 h-5" />
              View Menu
            </Link>
            <Link
              to="/reservations"
              className="px-6 py-4 rounded-2xl bg-white/10 border border-white/10 text-white font-semibold"
            >
              Reserve Table
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="container-app py-16">
        <h2 className="heading-lg mb-8">Browse by category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={'/menu/' + c.id} className="relative rounded-3xl overflow-hidden aspect-square border border-white/5">
              <img src={c.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-bold">{c.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="container-app py-16">
          <h2 className="heading-lg mb-8">Featured dishes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}	

