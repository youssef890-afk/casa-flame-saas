import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';
import { MobileBottomNav } from '../components/navigation/MobileBottomNav';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 pt-16 sm:pt-20 pb-24 md:pb-0"
      >
        <Outlet />
      </motion.main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
