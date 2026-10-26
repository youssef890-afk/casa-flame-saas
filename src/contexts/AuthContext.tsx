import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { clearLegacyUserCredentials, setCurrentUserId, type StoredUser } from '../lib/userStorage';
import { supabase } from '../lib/supabase';

interface AuthResult {
  ok: boolean;
  error?: string;
  needsEmailConfirmation?: boolean;
}

interface AuthContextValue {
  user: StoredUser | null;
  ready: boolean;
  signup: (name: string, email: string, password: string) => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toStoredUser(user: SupabaseUser | null): StoredUser | null {
  if (!user) return null;
  return {
    id: user.id,
    name: user.user_metadata.full_name || user.user_metadata.name || user.email?.split('@')[0] || '',
    email: user.email || '',
    createdAt: Date.parse(user.created_at),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    clearLegacyUserCredentials();

    let mounted = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = toStoredUser(session?.user ?? null);
      setCurrentUserId(nextUser?.id ?? null);
      setUser(nextUser);
      setReady(true);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) {
        console.error('Could not restore the Supabase session:', error.message);
      }
      const currentUser = toStoredUser(data.session?.user ?? null);
      setCurrentUserId(currentUser?.id ?? null);
      setUser(currentUser);
      setReady(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signup = async (name: string, email: string, password: string): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) return { ok: false, error: error.message };

    if (data.session?.user) {
      const nextUser = toStoredUser(data.session.user);
      setCurrentUserId(nextUser?.id ?? null);
      setUser(nextUser);
      return { ok: true };
    }

    return { ok: true, needsEmailConfirmation: true };
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) return { ok: false, error: error.message };

    const nextUser = toStoredUser(data.user);
    setCurrentUserId(nextUser?.id ?? null);
    setUser(nextUser);
    return { ok: true };
  };

  const logout = async (): Promise<AuthResult> => {
    const { error } = await supabase.auth.signOut();
    if (error) return { ok: false, error: error.message };

    setCurrentUserId(null);
    setUser(null);
    return { ok: true };
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
