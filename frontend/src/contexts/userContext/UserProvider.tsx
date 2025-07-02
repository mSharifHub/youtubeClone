import React, { useReducer, ReactNode, useEffect } from 'react';
import { UserContext } from './UserContext.tsx';
import { userReducer } from './userReducer.ts';
import { ViewerQuery } from '../../graphql/types.ts';
import { useQuery } from '@apollo/client';
import { VIEWER_QUERY } from '../../graphql/queries/queries.ts';

interface UserProviderProps {
  children: ReactNode;
}

const initialUserState = {
  user: null,
  isLoggedIn: false,
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialUserState);

  const { data, error } = useQuery<ViewerQuery>(VIEWER_QUERY, {
    fetchPolicy: 'network-only',
    pollInterval: 3600000,
  });

  useEffect(() => {
    if (error || !data || !data.viewer) {
      dispatch({ type: 'CLEAR_USER' });
      return;
    }
    dispatch({ type: 'SET_USER', payload: data.viewer });
  }, [data, error]);

  return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
};
