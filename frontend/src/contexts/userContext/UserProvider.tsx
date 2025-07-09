import React, { useReducer, ReactNode, useEffect } from 'react';
import { UserContext } from './UserContext.tsx';
import { userReducer } from './userReducer.ts';
import { useViewerLazyQuery } from '../../graphql/types.ts';
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

  const [fetchViewer, { data, error, loading, called }] = useViewerLazyQuery({ fetchPolicy: 'network-only' });

  useEffect(() => {
    fetchViewer();
  }, [fetchViewer, location.pathname]);

  useEffect(() => {
    if (loading) return;
    if (error || !data?.viewer) {
      dispatch({ type: 'CLEAR_USER' });
      return;
    }
    dispatch({ type: 'SET_USER', payload: data.viewer });
  }, [called, data, error, loading]);

  return <UserContext.Provider value={{ state, dispatch, loadingQuery: loading, errorQuery: error ? error.message : null }}>{children}</UserContext.Provider>;
};
