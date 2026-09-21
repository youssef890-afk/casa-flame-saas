import { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => remove(id), 4000);
  }, []);

  const success = (title: string, message?: string) =>
    push({ type: 'success', title, message });
  const error = (title: string, message?: string) =>
    push({ type: 'error', title, message });
  const info = (title: string, message?: string) =>
    push({ type: 'info', title, message });

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      <div className="fixed z-100 top-4 right-4 left-4 sm:left-auto sm:w-96 space-y-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto bg-charcoal-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-start gap-3 shadow-glass"
            >
              <div className="shrink-0 mt-0.5">
                {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {t.type === 'error' && <AlertCircle className="w-5 h-5 text-crimson-400" />}
                {t.type === 'info' && <Info className="w-5 h-5 text-gold-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{t.title}</p>
                {t.message && <p className="text-white/60 text-xs mt-0.5">{t.message}</p>}
              </div>
              <button
                onClick={() => remove(t.id)}
                className="shrink-0 p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
