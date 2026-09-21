import { Link } from 'react-router-dom';
import { Coins, Gift, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCoins } from '../../contexts/CoinsContext';
import { useToast } from '../../contexts/ToastContext';

const REWARDS = [
  { cost: 20, label: '5% Discount', desc: 'Save 5% on any order' },
  { cost: 50, label: '10% Discount', desc: 'Save 10% on any order' },
  { cost: 100, label: 'Free Coca Cola', desc: 'One free drink' },
  { cost: 200, label: 'Free Fries', desc: 'Hand-cut fries on us' },
  { cost: 500, label: '20% Discount', desc: 'Save 20% on any order' },
];

export default function RewardsPage() {
  const { coins, rewards, redeem } = useCoins();
  const { success, error } = useToast();

  const handleRedeem = (cost: number, label: string) => {
    const r = redeem(cost, label);
    if (r) success('Redeemed!', 'Code: ' + r.code);
    else error('Not enough coins', 'Play more to earn');
  };

  return (
    <div className="container-app py-10 max-w-2xl mx-auto">
      <Link to="/account" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-charcoal-900/60 border border-gold-500/30 mb-4">
          <Coins className="w-5 h-5 text-gold-400" />
          <span className="text-2xl font-bold">{coins}</span>
          <span className="text-white/50 text-sm">coins</span>
        </div>
        <h1 className="heading-lg">Rewards</h1>
        <p className="text-white/50 mt-2 text-sm">Redeem coins for discounts</p>
      </div>

      <div className="space-y-3 mb-8">
        {REWARDS.map((r) => {
          const canAfford = coins >= r.cost;
          return (
            <div key={r.cost} className={'rounded-3xl bg-charcoal-900/60 border p-5 flex items-center justify-between gap-3 ' + (canAfford ? 'border-white/10' : 'border-white/5 opacity-60')}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-gold-500/15 flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5 text-gold-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm">{r.label}</p>
                  <p className="text-xs text-white/50">{r.desc}</p>
                </div>
              </div>
              <button
                disabled={!canAfford}
                onClick={() => handleRedeem(r.cost, r.label)}
                className={'shrink-0 px-4 py-2.5 rounded-2xl text-xs font-semibold transition ' + (canAfford ? 'bg-flame-gradient text-white' : 'bg-white/5 text-white/40 cursor-not-allowed')}
              >
                {r.cost}c
              </button>
            </div>
          );
        })}
      </div>

      {rewards.length > 0 && (
        <div>
          <h2 className="font-bold mb-3">My rewards</h2>
          <div className="space-y-2">
            {rewards.map((r) => (
              <div key={r.id} className="rounded-2xl bg-emerald-500/10 border border-emerald-500/25 p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{r.label}</p>
                  <p className="text-xs text-white/50 mt-1">Code: <span className="font-mono text-emerald-300">{r.code}</span></p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
