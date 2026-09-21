import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Product } from '../types';
import { loadProducts, saveProducts, resetProducts } from '../lib/store';

interface ProductsContextValue {
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  reset: () => void;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => loadProducts());

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  const addProduct = (p: Product) => setProducts((prev) => [p, ...prev]);
  const updateProduct = (id: string, patch: Partial<Product>) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const deleteProduct = (id: string) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));
  const reset = () => {
    resetProducts();
    setProducts(loadProducts());
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, reset }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
