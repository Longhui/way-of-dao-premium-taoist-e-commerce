import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/store/useAuth';
interface AdminGuardProps {
  children: React.ReactNode;
}
export function AdminGuard({ children }: AdminGuardProps) {
  const user = useAuth((s) => s.user);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/shop" replace />;
  }
  return <>{children}</>;
}