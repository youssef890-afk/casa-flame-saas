import { useMemo, useState } from 'react';
import {
  Plus, Edit, Trash2, Copy, Search, ArrowUpDown,
  CheckSquare, Square, Image as ImageIcon, X, PackageX,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductsContext';
import { ProductForm } from './ProductForm';
import { formatPrice } from '../../lib/utils';
import type { Product } from '../../types';

type ProductExtra = Product & {
  available?: boolean;
  inStock?: boolean;
};

type SortOption = 'name' | 'price' | 'popularity';

function isAvailable(product: Product) {
  const item = product as ProductExtra;
  return item.available !== false && item.inStock !== false;
}

export default function ProductsPage() {
  const { products, categories, addProduct, deleteProduct, deleteProducts } = useProducts();
  const [editing, setEditing] = useState<Product | null | undefined>(undefined);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('name');
  const [preview, setPreview] = useState<{ src: string; alt: string } | null>(null);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      if (!query) return true;
      const category = categories.find((item) => item.id === product.categoryId);
      return [
        product.name, product.nameAr, product.nameFr, product.description,
        category?.name, category?.nameAr, category?.nameFr,
      ].filter(Boolean).some((value) => String(value).toLowerCase().includes(query));
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'price') return a.price - b.price;
      if (sort === 'popularity') {
        if (Boolean(a.popular) !== Boolean(b.popular)) return a.popular ? -1 : 1;
        return b.rating - a.rating;
      }
      return a.name.localeCompare(b.name);
    });
  }, [products, categories, search, sort]);

  const visibleIds = filteredProducts.map((p) => p.id);
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));

  const toggleSelected = (id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelected((current) => current.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelected((current) => Array.from(new Set([...current, ...visibleIds])));
    }
  };

  const duplicateProduct = (product: Product) => {
    const copy = {
      ...product,
      id: `${product.id}-copy-${Date.now().toString(36)}`,
      name: `${product.name} Copy`,
    } as Product;
    addProduct(copy);
  };

  const bulkDelete = () => {
    if (!selected.length) return;
    if (!confirm(`Delete ${selected.length} selected product(s)?`)) return;
    deleteProducts(selected);
    setSelected([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-white/50 text-sm mt-1">{products.length} items in your menu</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/categories"
            className="inline-flex items-center gap-2 h-11 px-4 rounded-2xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition"
          >
            Categories
          </Link>

          <button
            onClick={() => setEditing(null)}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-flame-gradient text-white font-semibold shadow-glow"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full h-11 rounded-2xl bg-charcoal-950 border border-white/10 pl-11 pr-10 text-sm text-white outline-none focus:border-ember-500/50"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="relative lg:w-56">
            <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="w-full h-11 rounded-2xl bg-charcoal-950 border border-white/10 pl-11 pr-4 text-sm text-white outline-none appearance-none"
            >
              <option value="name">Sort by name</option>
              <option value="price">Sort by price</option>
              <option value="popularity">Sort by popularity</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mt-3">
          <p className="text-xs text-white/40">
            Showing {filteredProducts.length} of {products.length}
          </p>
          {selected.length > 0 && (
            <button
              onClick={bulkDelete}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-xl bg-crimson-500/10 border border-crimson-500/20 text-crimson-300 text-xs font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete {selected.length}
            </button>
          )}
        </div>
      </div>

      <div className="rounded-3xl bg-charcoal-900/60 border border-white/5 overflow-hidden">
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="bg-white/5">
              <tr className="text-left text-xs text-white/50 uppercase">
                <th className="p-4 w-12">
                  <button onClick={toggleAll}>
                    {allSelected ? <CheckSquare className="w-4 h-4 text-ember-400" /> : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((product) => {
                const category = categories.find((c) => c.id === product.categoryId);
                const available = isAvailable(product);
                const checked = selected.includes(product.id);
                return (
                  <tr key={product.id} className="hover:bg-white/[0.02]">
                    <td className="p-4">
                      <button onClick={() => toggleSelected(product.id)}>
                        {checked ? <CheckSquare className="w-4 h-4 text-ember-400" /> : <Square className="w-4 h-4 text-white/50" />}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => product.image && setPreview({ src: product.image, alt: product.name })}>
                          {product.image ? (
                            <img src={product.image} alt="" className="w-12 h-12 rounded-2xl object-cover ring-1 ring-white/10" />
                          ) : (
                            <span className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-white/30" />
                            </span>
                          )}
                        </button>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{product.name}</p>
                          <p className="text-xs text-white/40 max-w-xs truncate">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-ember-400">{formatPrice(product.price)}</td>
                    <td className="p-4 text-sm text-white/60">{category?.name || product.categoryId}</td>
                    <td className="p-4">
                      {available ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">Available</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-crimson-500/10 border border-crimson-500/20 text-crimson-300 text-xs font-semibold">
                          <PackageX className="w-3 h-3" />
                          Out of stock
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => duplicateProduct(product)} className="p-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-gold-400">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditing(product)} className="p-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this product?')) {
                              deleteProduct(product.id);
                              setSelected((c) => c.filter((id) => id !== product.id));
                            }
                          }}
                          className="p-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-crimson-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden divide-y divide-white/5">
          {filteredProducts.map((product) => {
            const category = categories.find((c) => c.id === product.categoryId);
            const available = isAvailable(product);
            const checked = selected.includes(product.id);
            return (
              <div key={product.id} className="p-4">
                <div className="flex gap-3">
                  <button onClick={() => toggleSelected(product.id)} className="pt-1">
                    {checked ? <CheckSquare className="w-4 h-4 text-ember-400" /> : <Square className="w-4 h-4 text-white/50" />}
                  </button>
                  <button onClick={() => product.image && setPreview({ src: product.image, alt: product.name })} className="shrink-0">
                    {product.image ? (
                      <img src={product.image} alt="" className="w-16 h-16 rounded-2xl object-cover" />
                    ) : (
                      <span className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-white/30" />
                      </span>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{product.name}</p>
                        <p className="text-xs text-white/40 mt-1 line-clamp-2">{product.description}</p>
                      </div>
                      <span className="font-bold text-sm text-ember-400 whitespace-nowrap">{formatPrice(product.price)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-2 py-1 rounded-lg bg-white/5 text-[11px] text-white/55">{category?.name || product.categoryId}</span>
                      {product.popular && <span className="px-2 py-1 rounded-lg bg-gold-500/10 text-[11px] text-gold-400">Popular</span>}
                      {!available && <span className="px-2 py-1 rounded-lg bg-crimson-500/10 text-[11px] text-crimson-300">Out of stock</span>}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-3 pl-7">
                  <button onClick={() => duplicateProduct(product)} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 text-xs text-white/70">
                    <Copy className="w-3.5 h-3.5" />
                    Duplicate
                  </button>
                  <button onClick={() => setEditing(product)} className="p-2 rounded-xl bg-white/5 text-white/60">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this product?')) {
                        deleteProduct(product.id);
                        setSelected((c) => c.filter((id) => id !== product.id));
                      }
                    }}
                    className="p-2 rounded-xl bg-white/5 text-crimson-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-10 text-center">
            <PackageX className="w-8 h-8 mx-auto text-white/20" />
            <p className="mt-3 font-medium">No products found</p>
            <p className="text-sm text-white/40 mt-1">Try another search or add a new product.</p>
          </div>
        )}
      </div>

      {editing !== undefined && (
        <ProductForm initial={editing ?? undefined} onClose={() => setEditing(undefined)} />
      )}

      {preview && (
        <div className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img src={preview.src} alt={preview.alt} className="max-h-[85vh] max-w-full object-contain rounded-3xl shadow-2xl" />
            <button onClick={() => setPreview(null)} className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-charcoal-900 border border-white/10 flex items-center justify-center">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
