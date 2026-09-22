import { Routes, Route } from 'react-router-dom';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import { ProtectedAdmin } from './components/ProtectedAdmin';
import HomePage from './pages/customer/HomePage';
import MenuPage from './pages/customer/MenuPage';
import ProductPage from './pages/customer/ProductPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import ReservationsPage from './pages/customer/ReservationsPage';
import AccountPage from './pages/customer/AccountPage';
import GamesPage from './pages/customer/GamesPage';
import RewardsPage from './pages/customer/RewardsPage';
import MemoryGame from './pages/customer/games/MemoryGame';
import QuickTap from './pages/customer/games/QuickTap';
import ComingSoon from './pages/customer/games/ComingSoon';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/DashboardPage';
import AdminProducts from './pages/admin/ProductsPage';
import AdminOrders from './pages/admin/OrdersPage';
import AdminReservations from './pages/admin/ReservationsPage';
import AdminCategories from './pages/admin/CategoriesPage';
import AdminAnalytics from './pages/admin/AnalyticsPage';
import BackupPage from './pages/admin/BackupPage';
import ProtocolPage from './pages/admin/ProtocolPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/protocol" element={<ProtocolPage />} />

      <Route path="/admin" element={<ProtectedAdmin><AdminLayout /></ProtectedAdmin>}>
        <Route index element={<AdminDashboard />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="reservations" element={<AdminReservations />} />
        <Route path="backup" element={<BackupPage />} />
      </Route>

      <Route element={<CustomerLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/:category" element={<MenuPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/games/memory" element={<MemoryGame />} />
        <Route path="/games/reflex" element={<QuickTap />} />
        <Route path="/games/:id" element={<ComingSoon />} />
        <Route path="/rewards" element={<RewardsPage />} />
      </Route>
    </Routes>
  );
}
