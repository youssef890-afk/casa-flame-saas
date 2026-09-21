import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';
import { ProductForm } from './ProductForm';
import { formatPrice } from '../../lib/utils';
import type { Product } from '../../types';

export default function ProductsPage() {
  const { products, deleteProduct } = useProducts();
  const [editing, setEditing] = useState<Product | null | undefined>(undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-white/50 text-sm mt-1">{products.length} items in your menu</p>
        </div>
        <button
          onClick={() => setEditing(null)}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-flame-gradient text-white font-semibold shadow-glow"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr className="text-left text-xs text-white/50 uppercase">
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4 hidden sm:table-cell">Rating</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="w-11 h-11 rounded-2xl object-cover" />
                      <div>
                        <p className="font-medium text-sm">{p.name}</p>
                        <p className="text-xs text-white/40 max-w-xs truncate">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-ember-400">{formatPrice(p.price)}</td>
                  <td className="p-4 hidden sm:table-cell text-gold-400">{p.rating}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditing(p)}
                        className="p-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition"
                        aria-label="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this product?')) deleteProduct(p.id);
                        }}
                        className="p-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-crimson-400 transition"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing !== undefined && (
        <ProductForm initial={editing ?? undefined} onClose={() => setEditing(undefined)} />
      )}
    </div>
  );
}
