import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { ProgressiveImage } from '../ui/ProgressiveImage';

export function ProductCard({ product }: { product: Product }) {
  const image = product.image.replace(/\?w=(\d+)&q=(\d+)/, '?auto=format&fit=crop&w=$1&q=$2');

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 overflow-hidden hover:border-ember-500/30 transition-all duration-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <ProgressiveImage
            src={image}
            alt={product.name}
            width="800"
            height="600"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {product.popular && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-flame-gradient text-xs font-semibold">
              Popular
            </span>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h3 className="font-display font-semibold text-white line-clamp-1">{product.name}</h3>
            <span className="flex items-center gap-1 text-xs text-gold-400 shrink-0">
              {product.rating}
            </span>
          </div>
          <p className="text-sm text-white/75 line-clamp-2 mb-4 min-h-10">{product.description}</p>
          <div className="text-lg font-bold gradient-text">{formatPrice(product.price)}</div>
        </div>
      </div>
    </Link>
  );
}
