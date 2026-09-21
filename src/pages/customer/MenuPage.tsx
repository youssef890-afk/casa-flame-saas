import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CATEGORIES } from '../../services/demoData';
import { useProducts } from '../../contexts/ProductsContext';
import { ProductCard } from '../../components/product/ProductCard';
import { cn } from '../../lib/utils';

export default function MenuPage() {
  const { category } = useParams();
  const { products } = useProducts();
  const [active, setActive] = useState(category || 'all');

  const filtered = active === 'all' ? products : products.filter(p => p.categoryId === active);

  return (
    <div className="container-app py-10 sm:py-14">
      <div className="mb-8">
        <p className="text-ember-400 text-sm tracking-widest uppercase mb-2">Full menu</p>
        <h1 className="heading-lg mb-3">Explore our kitchen</h1>
      </div>

      <div className="sticky top-16 sm:top-20 z-20 -mx-4 px-4 py-4 bg-charcoal-950/95 backdrop-blur-xl border-y border-white/5 mb-8">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActive('all')}
            className={cn(
              'shrink-0 px-4 py-2.5 rounded-2xl text-sm font-medium border transition',
              active === 'all' ? 'bg-flame-gradient text-white border-transparent shadow-glow' : 'bg-white/5 border-white/10 text-white/70'
            )}
          >
            All
          </button>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={cn(
                'shrink-0 px-4 py-2.5 rounded-2xl text-sm font-medium border transition',
                active === c.id ? 'bg-flame-gradient text-white border-transparent shadow-glow' : 'bg-white/5 border-white/10 text-white/70'
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/40">No products in this category</p>
          <Link to="/menu" className="text-ember-400 text-sm mt-3 inline-block">Browse all</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
