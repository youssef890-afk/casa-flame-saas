import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

const DEFAULT_EMAIL = 'admin@emynfc.com';
const DEFAULT_PASSWORD = '1234';
const SESSION_KEY = 'casa_admin_session';
const CREDS_KEY = 'casa_admin_creds';

interface AdminAuthContextValue {
  isAdmin: boolean;
  login: (email: string, password: string, remember?: boolean) => boolean;
  logout: () => void;
  changePassword: (oldPw: string, newPw: string) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

function getCreds() {
  try {
    const raw = localStorage.getItem(CREDS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD };
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
      setIsAdmin(session === '1');
    } catch {}
  }, []);

  const login = (email: string, password: string, remember = true) => {
    const creds = getCreds();
    if (email.trim() === creds.email && password === creds.password) {
      try {
        if (remember) {
          localStorage.setItem(SESSION_KEY, '1');
        } else {
          sessionStorage.setItem(SESSION_KEY, '1');
        }
      } catch {}
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    try {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
    setIsAdmin(false);
  };

  const changePassword = (oldPw: string, newPw: string) => {
    const creds = getCreds();
    if (oldPw !== creds.password) return false;
    try { localStorage.setItem(CREDS_KEY, JSON.stringify({ ...creds, password: newPw })); } catch {}
    return true;
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, login, logout, changePassword }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
