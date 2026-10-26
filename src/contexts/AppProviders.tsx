import { ReactNode } from 'react';
import { LanguageProvider } from './LanguageContext';
import { AuthProvider } from './AuthContext';
import { ToastProvider } from './ToastContext';
import { AdminAuthProvider } from './AdminAuthContext';
import { ProductsProvider } from './ProductsContext';
import { OrdersProvider } from './OrdersContext';
import { ReservationsProvider } from './ReservationsContext';
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
              <OrdersProvider>
                <ReservationsProvider>
                  <CoinsProvider>
                    <FavoritesProvider>
                      <CartProvider>{children}</CartProvider>
                    </FavoritesProvider>
                  </CoinsProvider>
                </ReservationsProvider>
              </OrdersProvider>
            </ProductsProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
