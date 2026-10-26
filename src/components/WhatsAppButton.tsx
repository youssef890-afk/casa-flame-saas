import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { DEMO_RESTAURANT } from '../services/demoData';

export function WhatsAppButton() {
  const waNumber = DEMO_RESTAURANT.whatsapp.replace('+', '');
  const link = 'https://wa.me/' + waNumber;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40 w-14 h-14 rounded-full border border-ember-300/55 bg-charcoal-900/85 backdrop-blur-xl flex items-center justify-center text-white shadow-[0_10px_35px_rgba(0,0,0,.5),0_0_22px_rgba(255,95,15,.18)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-ember-200 hover:bg-charcoal-800 hover:shadow-[0_12px_38px_rgba(0,0,0,.55),0_0_28px_rgba(255,95,15,.28)] active:translate-y-0 active:scale-95"
      aria-label="WhatsApp"
      title="WhatsApp"
    >
      <span aria-hidden="true" className="absolute inset-0 rounded-full border border-ember-200/20 transition-all duration-500 group-hover:scale-125 group-hover:opacity-0" />
      <WhatsAppIcon className="relative z-10 w-6 h-6 text-emerald-200 transition-transform duration-300 group-hover:rotate-[-8deg]" />
      <span className="pointer-events-none absolute right-[calc(100%+0.75rem)] rounded-xl border border-white/10 bg-charcoal-900/90 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-glass backdrop-blur-xl transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">WhatsApp</span>
    </a>
  );
}
