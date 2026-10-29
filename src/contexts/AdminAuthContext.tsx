import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, supabaseConfigured } from '../lib/supabase';

const ADMIN_ROLES = new Set(['super_admin', 'restaurant_owner']);

interface AdminAuthContextValue {
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

function getAdminRoleFromUser(user: User | { app_metadata?: Record<string, any>; user_metadata?: Record<string, any> } | null | undefined) {
  const role = (user as { app_metadata?: Record<string, any>; user_metadata?: Record<string, any> } | null)?.app_metadata?.role
    ?? (user as { app_metadata?: Record<string, any>; user_metadata?: Record<string, any> } | null)?.user_metadata?.role;
  return typeof role === 'string' && ADMIN_ROLES.has(role) ? role : null;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = supabase;
    if (!supabaseConfigured || !client) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const syncAdminState = async () => {
      try {
        const { data: { session }, error } = await client.auth.getSession();
        if (!isMounted) return;
        if (error) {
          console.error('Could not read the Supabase admin session:', error.message);
          setIsAdmin(false);
          return;
        }

        const role = getAdminRoleFromUser(session?.user ?? null);
        setIsAdmin(Boolean(role));
      } catch (error) {
        console.error('Unexpected admin session error:', error);
        setIsAdmin(false);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void syncAdminState();

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      const role = getAdminRoleFromUser(session?.user ?? null);
      setIsAdmin(Boolean(role));
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, _remember = true) => {
    const client = supabase;
    if (!supabaseConfigured || !client) return false;

    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error || !data.user) {
      setIsAdmin(false);
      return false;
    }

    const role = getAdminRoleFromUser(data.user);
    const allowed = Boolean(role);
    setIsAdmin(allowed);
    return allowed;
  };

  const logout = async () => {
    if (supabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setIsAdmin(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
