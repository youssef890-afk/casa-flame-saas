import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container-app flex min-h-[55vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember-300">Casa Flame</p>
      <h1 className="mt-4 text-5xl font-semibold">404</h1>
      <p className="mt-3 text-white/60">We could not find that page.</p>
      <Link to="/menu" className="mt-7 rounded-xl bg-ember-500 px-5 py-3 font-semibold text-white hover:bg-ember-400">Browse the menu</Link>
    </div>
  );
}
