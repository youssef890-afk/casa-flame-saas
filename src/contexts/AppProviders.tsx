import { ReactNode } from 'react';
import { LanguageProvider } from './LanguageContext';
import { AuthProvider } from './AuthContext';
import { ToastProvider } from './ToastContext';
import { AdminAuthProvider } from './AdminAuthContext';
import { ProductsProvider } from './ProductsContext';
import { CoinsProvider } from './CoinsContext';
import { FavoritesProvider } from './FavoritesContext';
import { CartProvider } from './CartContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <ProductsProvider>
              <CoinsProvider>
                <FavoritesProvider>
                  <CartProvider>{children}</CartProvider>
                </FavoritesProvider>
              </CoinsProvider>
            </ProductsProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
