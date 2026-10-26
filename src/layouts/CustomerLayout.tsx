import { Outlet } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';

export default function CustomerLayout() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.main
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
}
