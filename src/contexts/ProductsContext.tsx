import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Category, Product } from '../types';
import { CATEGORIES } from '../services/demoData';
import { loadProducts, saveProducts, resetProducts } from '../lib/store';

const CATEGORIES_KEY = 'casa_categories_v1';

function loadCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return CATEGORIES;
}

function saveCategories(categories: Category[]) {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch {}
}

interface ProductsContextValue {
  products: Product[];
  categories: Category[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  deleteProducts: (ids: string[]) => void;
  reset: () => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, patch: Partial<Category>) => void;
  deleteCategory: (id: string) => boolean;
  getCategory: (id: string) => Category | undefined;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => loadProducts());
  const [categories, setCategories] = useState<Category[]>(() => loadCategories());

  useEffect(() => { saveProducts(products); }, [products]);
  useEffect(() => { saveCategories(categories); }, [categories]);

  const addProduct = (product: Product) => setProducts((prev) => [product, ...prev]);

  const updateProduct = (id: string, patch: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const deleteProducts = (ids: string[]) => {
    const selected = new Set(ids);
    setProducts((prev) => prev.filter((p) => !selected.has(p.id)));
  };

  const reset = () => {
    resetProducts();
    setProducts(loadProducts());
  };

  const addCategory = (category: Category) => setCategories((prev) => [category, ...prev]);

  const updateCategory = (id: string, patch: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const deleteCategory = (id: string) => {
    const used = products.some((p) => p.categoryId === id);
    if (used) return false;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    return true;
  };

  const getCategory = (id: string) => categories.find((c) => c.id === id);

  return (
    <ProductsContext.Provider value={{
      products, categories,
      addProduct, updateProduct, deleteProduct, deleteProducts, reset,
      addCategory, updateCategory, deleteCategory, getCategory,
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProducts must be used within ProductsProvider');
  return context;
}
