import { PRODUCTS as DEFAULT_PRODUCTS } from '../services/demoData';
import type { Product } from '../types';

const KEY = 'casa_products_v1';

export function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_PRODUCTS;
}

export function saveProducts(products: Product[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(products));
  } catch {}
}

export function resetProducts() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
