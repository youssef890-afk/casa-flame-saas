import { Link } from 'react-router-dom';
import { ArrowRight, Flame, UtensilsCrossed } from 'lucide-react';
import { DEMO_RESTAURANT } from '../../services/demoData';

export default function AboutPage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <img src={DEMO_RESTAURANT.heroImage} alt="A warmly lit restaurant dining room" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal-950 via-charcoal-950/85 to-charcoal-950/45" />
        <div className="container-app py-24 sm:py-32">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-ember-300">A little about us</p>
          <h1 className="heading-xl max-w-3xl">Good food, <span className="gradient-text">good company.</span></h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">Find {DEMO_RESTAURANT.name} in {DEMO_RESTAURANT.city}, explore the menu, and contact us directly through WhatsApp or Instagram.</p>
          <Link to="/menu" className="mt-9 inline-flex items-center gap-2 rounded-2xl bg-flame-gradient px-6 py-4 font-semibold text-white shadow-glow">
            Discover the menu <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="container-app grid gap-10 py-16 md:grid-cols-[1.1fr_.9fr] md:items-center sm:py-20">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-ember-400">{DEMO_RESTAURANT.name}</p>
          <h2 className="heading-lg">Good food and a warm welcome in {DEMO_RESTAURANT.city}.</h2>
          <p className="mt-5 leading-8 text-white/75">Explore the menu and discover our approach to freshly prepared food and a warm welcome.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card-surface p-6"><Flame className="mb-5 h-7 w-7 text-ember-400" /><h3 className="text-lg font-bold">Happy Eating</h3><p className="mt-2 text-sm leading-6 text-white/75">Visit us in {DEMO_RESTAURANT.city}.</p></div>
          <div className="card-surface p-6"><UtensilsCrossed className="mb-5 h-7 w-7 text-ember-400" /><h3 className="text-lg font-bold">Easy to explore</h3><p className="mt-2 text-sm leading-6 text-white/60">Browse dishes by category and find your next favorite.</p></div>
        </div>
      </section>
    </div>
  );
}
