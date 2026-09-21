import { useState } from 'react';
import { X } from 'lucide-react';
import type { Product } from '../../types';
import { useProducts } from '../../contexts/ProductsContext';
import { ImageUploader } from '../../components/ImageUploader';

type ProductFormValue = Product & {
  available?: boolean;
  inStock?: boolean;
};

export function ProductForm({
  initial,
  onClose,
}: {
  initial?: Product;
  onClose: () => void;
}) {
  const { addProduct, updateProduct, categories } = useProducts();

  const [form, setForm] = useState<ProductFormValue>(
    (initial as ProductFormValue | undefined) ?? {
      id: `p-${Date.now()}`,
      name: '',
      nameAr: '',
      nameFr: '',
      description: '',
      price: 0,
      image: '',
      categoryId: categories[0]?.id || 'burgers',
      rating: 5,
      available: true,
    }
  );

  const set = <K extends keyof ProductFormValue>(
    key: K,
    value: ProductFormValue[K]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.image) {
      alert('Please select an image');
      return;
    }

    if (!form.name.trim()) {
      alert('Product name is required');
      return;
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
    } as Product;

    if (initial) {
      updateProduct(initial.id, payload);
    } else {
      addProduct(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-y-auto">
      <div className="w-full max-w-lg bg-charcoal-900 rounded-3xl border border-white/10 my-8">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="font-bold">
            {initial ? 'Edit Product' : 'New Product'}
          </h3>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4">
          <ImageUploader
            value={form.image}
            onChange={(value) => set('image', value)}
          />

          <div>
            <label className="block text-sm mb-2">
              Product Name
            </label>

            <input
              value={form.name}
              onChange={(event) =>
                set('name', event.target.value)
              }
              required
              placeholder="e.g. Royal Burger"
              className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(event) =>
                set('description', event.target.value)
              }
              rows={2}
              placeholder="Short description..."
              className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-2">
                Price (MAD)
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(event) =>
                  set('price', Number(event.target.value))
                }
                required
                className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">
                Category
              </label>

              <select
                value={form.categoryId}
                onChange={(event) =>
                  set('categoryId', event.target.value)
                }
                className="w-full rounded-2xl bg-charcoal-950 border border-white/10 px-4 py-3 text-white"
              >
                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.popular || false}
                onChange={(event) =>
                  set('popular', event.target.checked)
                }
                className="w-5 h-5 accent-ember-500"
              />

              <span className="text-sm">
                Mark as Popular
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.available !== false}
                onChange={(event) =>
                  set('available', event.target.checked)
                }
                className="w-5 h-5 accent-ember-500"
              />

              <span className="text-sm">
                In stock
              </span>
            </label>
          </div>

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
