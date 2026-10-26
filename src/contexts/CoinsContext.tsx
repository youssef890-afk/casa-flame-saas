import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { scopedGet, scopedSet } from '../lib/userStorage';
import { useAuth } from './AuthContext';

const COINS_KEY = 'casa_coins';
const REWARDS_KEY = 'casa_rewards';

interface Reward {
  id: string;
  code: string;
  label: string;
  cost: number;
  createdAt: number;
}

interface CoinsContextValue {
  coins: number;
  rewards: Reward[];
  addCoins: (n: number) => void;
  redeem: (cost: number, label: string) => Reward | null;
}

const CoinsContext = createContext<CoinsContextValue | undefined>(undefined);

export function CoinsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [coins, setCoins] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    try {
      const c = scopedGet(COINS_KEY);
      setCoins(c ? parseInt(c, 10) || 0 : 0);
      const r = scopedGet(REWARDS_KEY);
      setRewards(r ? JSON.parse(r) : []);
    } catch {
      setCoins(0);
      setRewards([]);
    }
  }, [user?.id]);

  const persistCoins = (n: number) => {
    setCoins(n);
    scopedSet(COINS_KEY, String(n));
  };

  const addCoins = (n: number) => persistCoins(coins + n);

  const redeem = (cost: number, label: string): Reward | null => {
    if (coins < cost) return null;
    const reward: Reward = {
      id: 'r-' + Date.now(),
      code: 'CF-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      label,
      cost,
      createdAt: Date.now(),
    };
    persistCoins(coins - cost);
    const updated = [reward, ...rewards];
    setRewards(updated);
    scopedSet(REWARDS_KEY, JSON.stringify(updated));
    return reward;
  };

  return (
    <CoinsContext.Provider value={{ coins, rewards, addCoins, redeem }}>
      {children}
    </CoinsContext.Provider>
  );
}

export function useCoins() {
  const ctx = useContext(CoinsContext);
  if (!ctx) throw new Error('useCoins must be used within CoinsProvider');
  return ctx;
}
