import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { scopedGet, scopedSet } from '../lib/userStorage';
import { useAuth } from './AuthContext';

const KEY = 'casa_favorites';

interface FavoritesContextValue {
  favorites: string[];
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = scopedGet(KEY);
      setFavorites(raw ? JSON.parse(raw) : []);
    } catch {
      setFavorites([]);
    }
  }, [user?.id]);

  const persist = (arr: string[]) => {
    setFavorites(arr);
    scopedSet(KEY, JSON.stringify(arr));
  };

  const toggle = (id: string) => {
    persist(favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id]);
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
