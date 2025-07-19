import React, { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useUser } from '../contexts/userContext/UserContext.tsx';

type ProtectedUserRouteProps = {
  isLoggedIn: undefined | boolean;
  children: React.ReactNode;
  loading: boolean;
};

export const ProtectedUserRoute = ({ children, isLoggedIn, loading }: ProtectedUserRouteProps) => {
  const {
    state: { user },
  } = useUser();

  const { youtubeHandler } = useParams();

  if (loading || isLoggedIn === undefined) return null;

  if (!isLoggedIn || !user) {
    return <Navigate to="/" replace />;
  }

  if (youtubeHandler !== `@${user?.youtubeHandler}`) return <Navigate to={`@${user?.youtubeHandler}`} replace />;

  return <>{children}</>;
};
