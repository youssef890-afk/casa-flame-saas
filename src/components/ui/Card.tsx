import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface Props extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  glass?: boolean;
}

export function Card({ className, padding = 'md', glass, children, ...props }: Props) {
  const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return (
    <div
      className={cn(
        glass ? 'bg-white/5 backdrop-blur-xl border border-white/10' : 'bg-charcoal-900/60 border border-white/5',
        'rounded-3xl shadow-soft',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
