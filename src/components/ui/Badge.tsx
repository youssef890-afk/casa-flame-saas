import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'gold' | 'ember';

const tones: Record<Tone, string> = {
  neutral: 'bg-white/10 text-white/80 border-white/10',
  success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  warning: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  danger: 'bg-crimson-500/15 text-crimson-300 border-crimson-500/25',
  gold: 'bg-gold-500/15 text-gold-300 border-gold-500/25',
  ember: 'bg-ember-500/15 text-ember-300 border-ember-500/25',
};

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium', tones[tone], className)}>
      {children}
    </span>
  );
}
