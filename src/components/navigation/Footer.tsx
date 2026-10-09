import { Link } from 'react-router-dom';
import { Clock3, Flame, MapPin, Phone } from 'lucide-react';
import { DEMO_RESTAURANT } from '../../services/demoData';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';
import { useLanguage } from '../../contexts/LanguageContext';

export function Footer() {
  const { locale } = useLanguage();
  const waNumber = DEMO_RESTAURANT.whatsapp.replace(/\D/g, '');
  const phoneNumber = DEMO_RESTAURANT.phone.replace(/[^+\d]/g, '');
  const social = Object.entries(DEMO_RESTAURANT.social).filter(([, href]) => /^https:\/\//i.test(href));
  const labels = {
    en: { explore: 'Explore', about: 'About us', menu: 'Digital menu', book: 'Request a table', contactLink: 'Contact us', location: 'Location', contact: 'Restaurant details', hours: 'Opening hours', demo: 'Portfolio demonstration · verify business details before launch', rights: 'All rights reserved' },
    fr: { explore: 'Découvrir', about: 'À propos', menu: 'Menu digital', book: 'Demander une table', contactLink: 'Contact', location: 'Adresse', contact: 'Informations', hours: 'Horaires', demo: 'Démonstration portfolio · vérifiez les informations avant lancement', rights: 'Tous droits réservés' },
    ar: { explore: 'اكتشف', about: 'من نحن', menu: 'القائمة الرقمية', book: 'طلب حجز', contactLink: 'اتصل بنا', location: 'الموقع', contact: 'معلومات المطعم', hours: 'أوقات العمل', demo: 'عرض تجريبي · تأكد من معلومات المطعم قبل الإطلاق', rights: 'جميع الحقوق محفوظة' },
  }[locale];

  return (
    <footer className="border-t border-white/10 bg-charcoal-950">
      <div className="container-app grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Link to="/" className="inline-flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ember-500/15 text-ember-300"><Flame className="h-5 w-5" /></span><span className="font-semibold text-white">{DEMO_RESTAURANT.name}</span></Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">{DEMO_RESTAURANT.description}</p>
          <p className="mt-4 text-xs leading-5 text-amber-100/60">{labels.demo}</p>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold text-white">{labels.explore}</h2>
          <ul className="space-y-3 text-sm text-white/60">
            <li><Link to="/#about" className="hover:text-ember-200">{labels.about}</Link></li>
            <li><Link to="/menu" className="hover:text-ember-200">{labels.menu}</Link></li>
            <li><Link to="/reservations" className="hover:text-ember-200">{labels.book}</Link></li>
            <li><Link to="/#contact" className="hover:text-ember-200">{labels.contactLink}</Link></li>
          </ul>
          {social.length > 0 && <div className="mt-6 flex flex-wrap gap-4">{social.map(([platform, href]) => <a key={platform} href={href} target="_blank" rel="noopener noreferrer" className="text-sm capitalize text-white/55 hover:text-white">{platform}</a>)}</div>}
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold text-white">{labels.contact}</h2>
          <ul className="space-y-4 text-sm text-white/60">
            <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ember-300" /><span>{labels.location}: {DEMO_RESTAURANT.address}<span className="mt-1 block text-xs text-white/40">{DEMO_RESTAURANT.city}</span></span></li>
            <li className="flex items-start gap-3"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-ember-300" /><span>{labels.hours}<span className="mt-1 block text-xs text-white/50">{DEMO_RESTAURANT.hours}</span></span></li>
            {phoneNumber.replace(/\D/g, '').length >= 8 && <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-ember-300" /><a href={`tel:${phoneNumber}`} className="hover:text-white">{DEMO_RESTAURANT.phone}</a></li>}
            {waNumber.length >= 8 && waNumber.length <= 15 && <li className="flex items-center gap-3"><WhatsAppIcon className="h-4 w-4 text-emerald-300" /><a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a></li>}
            {DEMO_RESTAURANT.email && <li className="break-all"><a href={`mailto:${DEMO_RESTAURANT.email}`} className="hover:text-white">{DEMO_RESTAURANT.email}</a></li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5"><div className="container-app py-5 text-xs text-white/40">© {new Date().getFullYear()} {DEMO_RESTAURANT.name}. {labels.rights}.</div></div>
    </footer>
  );
}

