import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

export default function ComingSoon() {
  const { id } = useParams();

  return (
    <div className="container-app py-16 max-w-md mx-auto text-center">
      <Link to="/games" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-8">
        <ArrowLeft className="w-4 h-4" /> Games
      </Link>

      <div className="w-20 h-20 rounded-3xl bg-ember-500/15 border border-ember-500/30 flex items-center justify-center mx-auto mb-6">
        <Construction className="w-10 h-10 text-ember-400" />
      </div>

      <h1 className="text-2xl font-bold mb-3 capitalize">{id}</h1>
      <p className="text-white/60 mb-8">This game is coming soon. Check back later!</p>

      <Link to="/games" className="inline-block px-6 py-3 rounded-2xl bg-flame-gradient text-white font-semibold">
        Back to Games
      </Link>
    </div>
  );
}
