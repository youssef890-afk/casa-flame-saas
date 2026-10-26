import { useState, type ImgHTMLAttributes, type SyntheticEvent } from 'react';
import { cn } from '../../lib/utils';

type ProgressiveImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fetchpriority?: 'high' | 'low' | 'auto';
};

export function ProgressiveImage({ className, onLoad, onError, fetchpriority, ...props }: ProgressiveImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    setStatus('loaded');
    onLoad?.(event);
  };

  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    setStatus('error');
    onError?.(event);
  };

  return (
    <img
      {...props}
      {...(fetchpriority ? { fetchpriority } : {})}
      onLoad={handleLoad}
      onError={handleError}
      aria-busy={status === 'loading'}
      className={cn(
        className,
        status === 'loading' && 'image-skeleton',
        status === 'loaded' && 'image-loaded',
        status === 'error' && 'image-failed'
      )}
    />
  );
}
