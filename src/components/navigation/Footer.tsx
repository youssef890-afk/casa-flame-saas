import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { DEMO_RESTAURANT } from '../../services/demoData';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';
import { TikTokIcon } from '../icons/TikTokIcon';

const GOOGLE_MAPS_LINK = 'https://maps.app.goo.gl/tmnWThrTmRjXRQwy6?g_st=ac';

function SocialLink({
  href,
  label,
  color,
  glow,
  children,
}: {
  href: string;
  label: string;
  color: string;
  glow: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all hover:scale-110"
      style={{
        backgroundColor: color,
        boxShadow: '0 0 20px ' + glow + ', 0 0 40px ' + glow,
      }}
    >
      {children}
    </a>
  );
}

export function Footer() {
  const social = DEMO_RESTAURANT.social;
  const waNumber = DEMO_RESTAURANT.whatsapp.replace('+', '');

  return (
    <footer className="mt-24 border-t border-white/5 bg-charcoal-950/60">
      <div className="container-app py-12 grid gap-10 md:grid-cols-3">
        <div>
          <h4 className="font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/menu" className="hover:text-white transition">Menu</Link></li>
            <li><Link to="/reservations" className="hover:text-white transition">Reservations</Link></li>
            <li><Link to="/account" className="hover:text-white transition">Account</Link></li>
            <li><Link to="/games" className="hover:text-white transition">Games</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-ember-400" />
              {DEMO_RESTAURANT.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-ember-400" />
              <a href={'tel:' + DEMO_RESTAURANT.phone.replace(/\s/g, '')} className="hover:text-white transition">
                {DEMO_RESTAURANT.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-ember-400" />
              <a href={'mailto:' + DEMO_RESTAURANT.email} className="hover:text-white transition">
                {DEMO_RESTAURANT.email}
              </a>
            </li>
          </ul>

          <h4 className="font-semibold mb-4 mt-6">Follow us</h4>
          <div className="flex flex-wrap gap-3">
            <SocialLink
              href={social.instagram}
              label="Instagram"
              color="linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)"
              glow="rgba(220, 39, 67, 0.5)"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </SocialLink>

            <SocialLink
              href={social.facebook}
              label="Facebook"
              color="#1877F2"
              glow="rgba(24, 119, 242, 0.5)"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </SocialLink>

            <SocialLink
              href={social.tiktok || 'https://tiktok.com/@emynfc'}
              label="TikTok"
              color="#000000"
              glow="rgba(37, 244, 238, 0.6)"
            >
              <TikTokIcon className="w-5 h-5" />
            </SocialLink>

            <SocialLink
              href={'https://wa.me/' + waNumber}
              label="WhatsApp"
              color="#25D366"
              glow="rgba(37, 211, 102, 0.5)"
            >
              <WhatsAppIcon className="w-5 h-5" />
            </SocialLink>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Find us</h4>
          <a
            href={GOOGLE_MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl overflow-hidden border border-white/10 hover:border-ember-500/50 transition group"
          >
            <div className="relative aspect-video bg-gradient-to-br from-ember-500/20 to-crimson-500/10 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-ember-400 mx-auto mb-3 group-hover:scale-110 transition" />
                <p className="font-bold">{DEMO_RESTAURANT.address}</p>
                <p className="text-xs text-white/60 mt-2">Tap to open in Google Maps</p>
              </div>
            </div>
          </a>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-app py-6 text-center text-xs text-white/40">
          {new Date().getFullYear()} - All rights reserved
        </div>
      </div>
    </footer>
  );
}
