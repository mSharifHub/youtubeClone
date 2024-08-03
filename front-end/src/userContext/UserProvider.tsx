import React, { useReducer, ReactNode } from 'react';
import { UserContext } from './UserContext';
import { initialState, userReducer } from './userReducer.ts';
// import { useQuery } from '@apollo/client';
// import { ViewerQuery } from '../graphql/types.ts';
// import { VIEWER_QUERY } from '../graphql/queries/queries.ts';

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);


  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
