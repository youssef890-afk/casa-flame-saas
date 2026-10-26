import { Link } from 'react-router-dom';
import { Instagram, MapPin, MessageCircle, Phone, ArrowUpRight } from 'lucide-react';
import { DEMO_RESTAURANT } from '../../services/demoData';

export default function ContactPage() {
  const whatsapp = `https://wa.me/${DEMO_RESTAURANT.whatsapp.replace(/\D/g, '')}`;

  return (
    <div className="container-app py-12 sm:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-ember-300">{DEMO_RESTAURANT.name}</p>
        <h1 className="heading-lg">Come say hello.</h1>
        <p className="mt-4 leading-7 text-white/85">Questions about the menu or an order? Contact us directly or visit our shop in {DEMO_RESTAURANT.city}.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="card-surface group p-6 transition hover:border-emerald-400/40 sm:p-8">
          <MessageCircle className="mb-6 h-8 w-8 text-emerald-400" aria-hidden="true" />
          <h2 className="text-xl font-bold">Message us on WhatsApp</h2>
          <p className="mt-2 text-white/80"><bdi dir="ltr">{DEMO_RESTAURANT.phone}</bdi></p>
          <span className="mt-6 inline-flex items-center gap-2 font-semibold text-emerald-300">Start a conversation <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></span>
        </a>

        <a href={DEMO_RESTAURANT.instagram} target="_blank" rel="noopener noreferrer" className="card-surface group p-6 transition hover:border-ember-400/40 sm:p-8">
          <Instagram className="mb-6 h-8 w-8 text-ember-300" aria-hidden="true" />
          <h2 className="text-xl font-bold">Follow us on Instagram</h2>
          <p className="mt-2 text-white/80">@happy.eating.snack</p>
          <span className="mt-6 inline-flex items-center gap-2 font-semibold text-ember-200">Visit our profile <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></span>
        </a>

        <a href={`tel:${DEMO_RESTAURANT.phoneInternational}`} className="card-surface group p-6 transition hover:border-ember-400/40 sm:p-8">
          <Phone className="mb-6 h-8 w-8 text-ember-300" aria-hidden="true" />
          <h2 className="text-xl font-bold">Call the restaurant</h2>
          <p className="mt-2 text-white/85" dir="ltr">{DEMO_RESTAURANT.phone}</p>
        </a>

        <a href={DEMO_RESTAURANT.mapsUrl} target="_blank" rel="noopener noreferrer" className="card-surface group p-6 transition hover:border-ember-400/40 sm:p-8">
          <MapPin className="mb-6 h-8 w-8 text-ember-300" aria-hidden="true" />
          <h2 className="text-xl font-bold">Find us in {DEMO_RESTAURANT.city}</h2>
          <p className="mt-2 text-white/85">{DEMO_RESTAURANT.address}</p>
          <span className="mt-6 inline-flex items-center gap-2 font-semibold text-ember-200">Open map <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></span>
        </a>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <span className="text-white/85">Visit {DEMO_RESTAURANT.name} in {DEMO_RESTAURANT.city}, Morocco.</span>
        <Link to="/reservations" className="ms-auto rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/5">Request a table</Link>
      </div>
    </div>
  );
}
