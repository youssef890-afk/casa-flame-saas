import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Coins, RotateCcw, ArrowLeft, Clock } from 'lucide-react';
import { useCoins } from '../../../contexts/CoinsContext';
import { useToast } from '../../../contexts/ToastContext';

const EMOJIS = ['🍔', '🍕', '🌮', '🍟', '🍰', '🥤', '🍗', '🥗'];
const TIME_LIMIT = 45;

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

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>(() => buildDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [rewarded, setRewarded] = useState(false);
  const [time, setTime] = useState(TIME_LIMIT);
  const { coins, addCoins } = useCoins();
  const { success } = useToast();

  useEffect(() => {
    if (won || lost) return;
    if (time <= 0) {
      setLost(true);
      return;
    }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [time, won, lost]);

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
    }, same ? 350 : 700);
    return () => clearTimeout(t);
  }, [flipped, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched) && !won && !lost) {
      setWon(true);
      const earned = Math.max(5, 30 - Math.max(0, moves - 8));
      addCoins(earned);
      setRewarded(true);
      success('You won!', '+' + earned + ' coins');
    }
  }, [cards, moves, won, lost, addCoins, success]);

  const handleClick = (i: number) => {
    if (flipped.length >= 2 || flipped.includes(i) || cards[i].matched || won || lost) return;
    setFlipped((f) => [...f, i]);
  };

  const restart = () => {
    setCards(buildDeck());
    setFlipped([]);
    setMoves(0);
    setWon(false);
    setLost(false);
    setRewarded(false);
    setTime(TIME_LIMIT);
  };

  return (
    <div className="container-app py-8 max-w-md mx-auto">
      <Link to="/games" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Games
      </Link>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-1">Food Memory</h1>
        <p className="text-white/50 text-sm">Match all pairs</p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-4">
        <div className={'px-4 py-2 rounded-2xl flex items-center gap-2 ' + (time <= 10 ? 'bg-crimson-500/20 border border-crimson-500/40' : 'bg-charcoal-900/60 border border-white/10')}>
          <Clock className={'w-4 h-4 ' + (time <= 10 ? 'text-crimson-400' : 'text-white/60')} />
          <span className={'font-bold ' + (time <= 10 ? 'text-crimson-400' : '')}>{time}s</span>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-charcoal-900/60 border border-gold-500/30 flex items-center gap-2">
          <Coins className="w-4 h-4 text-gold-400" />
          <span className="font-bold">{coins}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6">
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
        <div className="rounded-3xl bg-charcoal-900/60 border border-emerald-500/30 p-6 text-center">
          <Trophy className="w-12 h-12 text-gold-400 mx-auto mb-2" />
          <h2 className="text-lg font-bold mb-1">You won!</h2>
          <p className="text-white/60 text-sm mb-3">{moves} moves - {TIME_LIMIT - time}s</p>
          <p className="text-2xl font-bold gradient-text mb-4">Coins added!</p>
          <button onClick={restart} className="px-5 py-2.5 rounded-2xl bg-flame-gradient text-white font-semibold">
            <RotateCcw className="w-4 h-4 inline mr-1" /> Play again
          </button>
        </div>
      )}

      {lost && (
        <div className="rounded-3xl bg-charcoal-900/60 border border-crimson-500/30 p-6 text-center">
          <h2 className="text-lg font-bold mb-2 text-crimson-400">Time's up!</h2>
          <p className="text-white/60 text-sm mb-4">Try again</p>
          <button onClick={restart} className="px-5 py-2.5 rounded-2xl bg-flame-gradient text-white font-semibold">
            <RotateCcw className="w-4 h-4 inline mr-1" /> Try again
          </button>
        </div>
      )}
    </div>
  );
}
