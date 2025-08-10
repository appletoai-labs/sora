// components/auth/ProtectedRoute.tsx
'use client';

import type React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePremium?: boolean;
  requireNonPremium?: boolean; // ✅ Added this
}

export const ProtectedRoute = ({
  children,
  requirePremium = false,
  requireNonPremium = false, // ✅ Default to false
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // ✅ Premium-only restriction
  if (requirePremium && !user.isPremium) {
    return <Navigate to="/subscription" replace />;
  }

  // ✅ Non-premium-only restriction
  if (requireNonPremium && user.isPremium) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};
