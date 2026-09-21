import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Shield } from 'lucide-react';
import { DEMO_RESTAURANT } from '../../services/demoData';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-charcoal-950/60">
      <div className="container-app py-12 grid gap-8 md:grid-cols-3">
        <div>
          <h4 className="font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/menu" className="hover:text-white transition">Menu</Link></li>
            <li><Link to="/reservations" className="hover:text-white transition">Reservations</Link></li>
            <li><Link to="/account" className="hover:text-white transition">Account</Link></li>
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
        </div>

        <div>
          <h4 className="font-semibold mb-4">Restaurant Owner</h4>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm"
          >
            <Shield className="w-4 h-4 text-ember-400" />
            Admin Login
          </Link>
          <p className="text-xs text-white/40 mt-3">
            Manage your menu, orders, and reservations.
          </p>
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
