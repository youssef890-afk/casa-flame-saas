import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { Product, CartLine } from '../types';
import { scopedGet, scopedSet } from '../lib/userStorage';
import { useAuth } from './AuthContext';

const KEY = 'casa_cart';

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function readCart(value: string | null): CartLine[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((line): line is CartLine =>
      typeof line === 'object'
      && line !== null
      && 'product' in line
      && typeof line.product === 'object'
      && line.product !== null
      && 'id' in line.product
      && typeof line.product.id === 'string'
      && 'quantity' in line
      && typeof line.quantity === 'number'
      && Number.isInteger(line.quantity)
      && line.quantity > 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      if (!user) {
        setLines(readCart(scopedGet(KEY)));
        return;
      }

      const guestLines = readCart(localStorage.getItem(`${KEY}__guest`));
      const userKey = `${KEY}__${user.id}`;
      const userLines = readCart(localStorage.getItem(userKey));
      const merged = new Map(userLines.map((line) => [line.product.id, line]));

      for (const guestLine of guestLines) {
        const existing = merged.get(guestLine.product.id);
        merged.set(guestLine.product.id, {
          ...guestLine,
          quantity: guestLine.quantity + (existing?.quantity ?? 0),
        });
      }

      const nextLines = [...merged.values()];
      if (guestLines.length > 0) localStorage.setItem(userKey, JSON.stringify(nextLines));
      setLines(nextLines);
    } catch {
      setLines(readCart(scopedGet(KEY)));
    }
  }, [user]);

  const persist = (arr: CartLine[]) => {
    setLines(arr);
    scopedSet(KEY, JSON.stringify(arr));
  };

  const add = (product: Product, qty = 1) => {
    const found = lines.find((l) => l.product.id === product.id);
    if (found) {
      persist(lines.map((l) => (l.product.id === product.id ? { ...l, quantity: l.quantity + qty } : l)));
    } else {
      persist([...lines, { product, quantity: qty }]);
    }
  };

  const remove = (id: string) => persist(lines.filter((l) => l.product.id !== id));

  const setQty = (id: string, qty: number) => {
    if (qty <= 0) return remove(id);
    persist(lines.map((l) => (l.product.id === id ? { ...l, quantity: qty } : l)));
  };

  const clear = () => persist([]);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((s, l) => s + l.quantity, 0);
    const subtotal = lines.reduce((s, l) => s + l.quantity * l.product.price, 0);
    return { lines, count, subtotal, add, remove, setQty, clear };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
