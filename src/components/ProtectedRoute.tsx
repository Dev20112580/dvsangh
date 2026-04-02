import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSupabase } from '../SupabaseContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, userProfile, isAuthReady } = useSupabase();
  const location = useLocation();

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dvs-orange"></div>
      </div>
    );
  }

  if (!user || !userProfile) {
    // Redirect to login but save the attempted url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    // Role not authorized, redirect to their main dashboard or home
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
