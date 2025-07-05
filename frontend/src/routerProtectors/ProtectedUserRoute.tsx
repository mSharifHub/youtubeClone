import React from 'react';
import { Navigate } from 'react-router-dom';

type ProtectedUserRouteProps = {
  isLoggedIn: undefined | boolean;
  children: React.ReactNode;
  loading: boolean;
};

export const ProtectedUserRoute = ({ children, isLoggedIn, loading }: ProtectedUserRouteProps) => {
  if (loading || isLoggedIn === undefined) return null;
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
