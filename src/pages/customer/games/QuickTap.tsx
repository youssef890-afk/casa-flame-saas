import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Coins, RotateCcw, ArrowLeft, Clock, Target } from 'lucide-react';
import { useCoins } from '../../../contexts/CoinsContext';
import { useToast } from '../../../contexts/ToastContext';

const TIME_LIMIT = 15;

export default function QuickTap() {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(TIME_LIMIT);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [target, setTarget] = useState({ x: 50, y: 50 });
  const { addCoins } = useCoins();
  const { success } = useToast();

  useEffect(() => {
    if (!started || done) return;
    if (time <= 0) {
      setDone(true);
      const earned = Math.min(score, 40);
      if (earned > 0) {
        addCoins(earned);
        success('Time up!', '+' + earned + ' coins');
      }
      return;
    }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [time, started, done, score, addCoins, success]);

  const hit = () => {
    setScore((s) => s + 1);
    setTarget({
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 70,
    });
  };

  const restart = () => {
    setScore(0);
    setTime(TIME_LIMIT);
    setStarted(false);
    setDone(false);
    setTarget({ x: 50, y: 50 });
  };

  return (
    <div className="container-app py-8 max-w-md mx-auto">
      <Link to="/games" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Games
      </Link>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-1">Quick Tap</h1>
        <p className="text-white/50 text-sm">Tap the circle as fast as you can</p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-4">
        <div className={'px-4 py-2 rounded-2xl flex items-center gap-2 ' + (time <= 5 ? 'bg-crimson-500/20 border border-crimson-500/40' : 'bg-charcoal-900/60 border border-white/10')}>
          <Clock className={'w-4 h-4 ' + (time <= 5 ? 'text-crimson-400' : 'text-white/60')} />
          <span className={'font-bold ' + (time <= 5 ? 'text-crimson-400' : '')}>{time}s</span>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-charcoal-900/60 border border-white/10 flex items-center gap-2">
          <Target className="w-4 h-4 text-ember-400" />
          <span className="font-bold">{score}</span>
        </div>
      </div>

      <div className="relative w-full aspect-square rounded-3xl bg-charcoal-900/60 border border-white/10 overflow-hidden mb-6">
        {!started && !done && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setStarted(true)}
              className="px-8 py-4 rounded-2xl bg-flame-gradient text-white font-bold shadow-glow"
            >
              Start
            </button>
          </div>
        )}

        {started && !done && (
          <button
            onClick={hit}
            className="absolute w-16 h-16 rounded-full bg-flame-gradient shadow-glow flex items-center justify-center text-white text-xl"
            style={{ left: target.x + '%', top: target.y + '%', transform: 'translate(-50%, -50%)' }}
          >
            <Target className="w-6 h-6" />
          </button>
        )}

        {done && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-white/60 text-sm mb-2">Score</p>
            <p className="text-5xl font-bold gradient-text mb-6">{score}</p>
            <button onClick={restart} className="px-6 py-3 rounded-2xl bg-flame-gradient text-white font-semibold">
              <RotateCcw className="w-4 h-4 inline mr-2" /> Play again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
