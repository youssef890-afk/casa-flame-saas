import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  type StoredUser,
} from '../lib/userStorage';

interface AuthContextValue {
  user: StoredUser | null;
  ready: boolean;
  signup: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setReady(true);
  }, []);

  const signup = (name: string, email: string, password: string) => {
    const res = signupUser(name, email, password);
    if (res.ok && res.user) setUser(res.user);
    return { ok: res.ok, error: res.error };
  };

  const login = (email: string, password: string) => {
    const res = loginUser(email, password);
    if (res.ok && res.user) setUser(res.user);
    return { ok: res.ok, error: res.error };
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
