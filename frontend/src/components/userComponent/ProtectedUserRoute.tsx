import React from 'react';
import { Navigate } from 'react-router-dom';
import SpinningCircle from '../VideoComponents/SpinningCircle.tsx';

type ProtectedUserRouteProps = {
  isLoggedIn: undefined | boolean;
  children: React.ReactNode;
  loading: boolean;
};

export const ProtectedUserRoute = ({ children, isLoggedIn, loading }: ProtectedUserRouteProps) => {
  if (loading || isLoggedIn === undefined) {
    return (
      <div className="h-screen w-screen flex justify-start items-start p-8">
        <SpinningCircle style=" min-h-20 min-w-20  h-20 w-20 border-4" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
