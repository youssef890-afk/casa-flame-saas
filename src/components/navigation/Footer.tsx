import { DEMO_RESTAURANT } from '../../services/demoData';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-charcoal-950">
      <div className="container-app py-4 text-center text-xs text-white/75">
        © 2026 {DEMO_RESTAURANT.name}
      </div>
    </footer>
  );
}
