// "use client"

// import type React from "react"

// import { Navigate } from "react-router-dom"
// import { useAuth } from "@/hooks/useAuth"

// interface ProtectedRouteProps {
//   children: React.ReactNode
//   requireEmailVerified?: boolean
// }

// export const ProtectedRoute = ({ children, requireEmailVerified = false }: ProtectedRouteProps) => {
//   const { user, loading } = useAuth()

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-background to-background/50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//           <p className="text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   // Not authenticated - redirect to auth
//   if (!user) {
//     return <Navigate to="/auth" replace />
//   }

//   // Email verification required but not verified
//   if (requireEmailVerified && !user.isEmailVerified) {
//     return <Navigate to="/verify-email" replace />
//   }

//   return <>{children}</>
// }


"use client";

import type React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
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

  // If user is not logged in, redirect to /auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
