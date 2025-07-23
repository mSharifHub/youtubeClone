import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useUser } from '../contexts/userContext/UserContext.tsx';
import NotFound from '../components/pages/NotFound.tsx';

type ProtectedUserRouteProps = {
  isLoggedIn: undefined | boolean;
  children: React.ReactNode;
  loading: boolean;
};

//TODO change the component to be reusable to all use cases
export const ProtectedUserRoute = ({ children, isLoggedIn, loading }: ProtectedUserRouteProps) => {
  const {
    state: { user },
  } = useUser();

  const { youtubeHandler } = useParams();

  if (loading || isLoggedIn === undefined) return null;

  if (!isLoggedIn || !user) {
    return <Navigate to="/" replace />;
  }

  if (youtubeHandler !== `@${user?.youtubeHandler}`) return <NotFound />;

  return <>{children}</>;
};
