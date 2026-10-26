import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Coins, RotateCcw, ArrowLeft } from 'lucide-react';
import { useCoins } from '../../contexts/CoinsContext';
import { useToast } from '../../contexts/ToastContext';

const EMOJIS = ['🍔', '🍕', '🌮', '🍟', '🍰', '🥤', '🍗', '🥗'];

interface Card { id: number; emoji: string; matched: boolean; }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): Card[] {
  const deck: Card[] = [];
  EMOJIS.forEach((emoji, idx) => {
    deck.push({ id: idx * 2, emoji, matched: false });
    deck.push({ id: idx * 2 + 1, emoji, matched: false });
  });
  return shuffle(deck);
}

export default function GamePage() {
  const [cards, setCards] = useState<Card[]>(() => buildDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [rewarded, setRewarded] = useState(false);
  const [reward, setReward] = useState(0);
  const { coins, addCoins } = useCoins();
  const { success } = useToast();

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped;
    const same = cards[a].emoji === cards[b].emoji;
    setMoves((m) => m + 1);
    const t = setTimeout(() => {
      if (same) {
        setCards((prev) => prev.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)));
      }
      setFlipped([]);
    }, same ? 400 : 800);
    return () => clearTimeout(t);
  }, [flipped, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched) && !won) {
      setWon(true);
      const earned = Math.max(5, 30 - Math.max(0, moves - 8));
      setReward(earned);
    }
  }, [cards, moves, won]);

  const handleClick = (i: number) => {
    if (flipped.length >= 2 || flipped.includes(i) || cards[i].matched) return;
    setFlipped((f) => [...f, i]);
  };

  const claim = () => {
    if (rewarded) return;
    addCoins(reward);
    setRewarded(true);
    success('Coins added!', '+' + reward + ' coins');
  };

  const restart = () => {
    setCards(buildDeck());
    setFlipped([]);
    setMoves(0);
    setWon(false);
    setRewarded(false);
    setReward(0);
  };

  return (
    <div className="container-app py-10 max-w-2xl mx-auto">
      <Link to="/account" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="text-center mb-6">
        <p className="text-ember-400 text-sm tracking-widest uppercase mb-2">Play and Earn</p>
        <h1 className="heading-lg mb-2">Food Memory</h1>
        <p className="text-white/50 text-sm">Match all pairs to win coins</p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="px-4 py-2 rounded-2xl bg-charcoal-900/60 border border-gold-500/30 flex items-center gap-2">
          <Coins className="w-4 h-4 text-gold-400" />
          <span className="font-bold">{coins}</span>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-charcoal-900/60 border border-white/10 text-sm">
          Moves: <span className="font-bold">{moves}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto mb-8">
        {cards.map((c, i) => {
          const isFlipped = flipped.includes(i) || c.matched;
          return (
            <button
              key={c.id}
              onClick={() => handleClick(i)}
              className={
                'aspect-square rounded-2xl flex items-center justify-center text-2xl transition-all ' +
                (isFlipped ? 'bg-charcoal-900 border border-white/10' : 'bg-flame-gradient shadow-lg')
              }
            >
              {isFlipped ? c.emoji : ''}
            </button>
          );
        })}
      </div>

      {won && (
        <div className="rounded-3xl bg-charcoal-900/60 border border-ember-500/30 p-6 text-center">
          <Trophy className="w-12 h-12 text-gold-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">You won!</h2>
          <p className="text-white/60 mb-4 text-sm">Completed in {moves} moves</p>
          <p className="text-2xl font-bold gradient-text mb-6">+{reward} coins</p>
          {!rewarded ? (
            <button onClick={claim} className="px-6 py-3 rounded-2xl bg-flame-gradient text-white font-semibold shadow-glow">
              Claim Coins
            </button>
          ) : (
            <p className="text-emerald-400 font-semibold">Coins claimed!</p>
          )}
          <button onClick={restart} className="mx-auto mt-4 text-sm text-white/50 hover:text-white flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Play again
          </button>
        </div>
      )}

      <div className="text-center mt-6">
        <Link to="/rewards" className="text-ember-400 text-sm hover:text-ember-300">
          Redeem coins for discounts
        </Link>
      </div>
    </div>
  );
}
