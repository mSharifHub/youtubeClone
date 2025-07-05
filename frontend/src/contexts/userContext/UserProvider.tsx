import React, { useReducer, ReactNode, useEffect } from 'react';
import { UserContext } from './UserContext.tsx';
import { userReducer } from './userReducer.ts';
import { ViewerQuery } from '../../graphql/types.ts';
import { useLazyQuery } from '@apollo/client';
import { VIEWER_QUERY } from '../../graphql/queries/queries.ts';
import { useLocation } from 'react-router-dom';

interface UserProviderProps {
  children: ReactNode;
}

const initialUserState = {
  user: null,
  isLoggedIn: undefined,
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialUserState);
  const location = useLocation();

  const [fetchViewer, { data, error, loading, called }] = useLazyQuery<ViewerQuery>(VIEWER_QUERY, { fetchPolicy: 'network-only' });

  useEffect(() => {
    fetchViewer();
  }, [fetchViewer, location.pathname]);

  useEffect(() => {
    if (!called || loading) return;
    if (error || !data || !data.viewer) {
      dispatch({ type: 'CLEAR_USER' });
      return;
    }
    dispatch({ type: 'SET_USER', payload: data.viewer });
  }, [called, data, error, loading]);

  return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
};
