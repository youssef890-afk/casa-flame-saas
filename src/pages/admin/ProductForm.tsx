import { useState } from 'react';
import { X } from 'lucide-react';
import type { Product } from '../../types';
import { useProducts } from '../../contexts/ProductsContext';
import { ImageUploader } from '../../components/ImageUploader';

export function ProductForm({ initial, onClose }: { initial?: Product; onClose: () => void }) {
  const { addProduct, updateProduct } = useProducts();
  const [form, setForm] = useState<Product>(
    initial ?? {
      id: 'p-' + Date.now(),
      name: '',
      nameAr: '',
      nameFr: '',
      description: '',
      price: 0,
      image: '',
      categoryId: 'burgers',
      rating: 5,
    }
  );

  const set = (k: keyof Product, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) {
      alert('Please select an image');
      return;
    }
    if (initial) updateProduct(initial.id, form);
    else addProduct(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-y-auto">
      <div className="w-full max-w-lg bg-charcoal-900 rounded-3xl border border-white/10 my-8">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="font-bold">{initial ? 'Edit Product' : 'New Product'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4">
          <ImageUploader value={form.image} onChange={(v) => set('image', v)} />

          <div>
            <label className="block text-sm mb-2">Product Name</label>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
              placeholder="e.g. Royal Burger"
              className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
              placeholder="Short description..."
              className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-2">Price (MAD)</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => set('price', Number(e.target.value))}
                required
                className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => set('categoryId', e.target.value)}
                className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white"
              >
                <option value="burgers">Burgers</option>
                <option value="tacos">Tacos</option>
                <option value="pizza">Pizza</option>
                <option value="moroccan">Moroccan</option>
                <option value="desserts">Desserts</option>
                <option value="drinks">Drinks</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.popular || false}
              onChange={(e) => set('popular', e.target.checked)}
              className="w-5 h-5 accent-ember-500"
            />
            <span className="text-sm">Mark as Popular</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-12 rounded-2xl bg-flame-gradient text-white font-semibold"
            >
              {initial ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
