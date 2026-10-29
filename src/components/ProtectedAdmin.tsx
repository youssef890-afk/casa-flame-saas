import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

export function ProtectedAdmin({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-950 text-white/70">
        Loading admin access...
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
