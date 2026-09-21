import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  className, variant = 'primary', size = 'md', fullWidth,
  leftIcon, rightIcon, children, ...props
}: Props) {
  const variants = {
    primary: 'bg-flame-gradient text-white hover:shadow-glow',
    secondary: 'bg-white/10 text-white hover:bg-white/15 border border-white/10',
    outline: 'border border-white/20 text-white hover:bg-white/5',
    ghost: 'text-white/80 hover:text-white hover:bg-white/5',
  };
  const sizes = {
    sm: 'h-9 px-3 text-sm rounded-xl',
    md: 'h-11 px-5 text-sm rounded-2xl',
    lg: 'h-14 px-7 text-base rounded-2xl',
  };
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all',
        variants[variant], sizes[size], fullWidth && 'w-full', className
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
