import React, { useReducer, ReactNode } from 'react';
import { UserContext } from './UserContext';
import { userReducer } from './userReducer.ts';
import Cookies from 'js-cookie';
import { ViewerQuery } from '../graphql/types.ts';
import {
  decryptData,
  encryptData,
} from '../components/helpers/CookieEncryption.ts';
import { useQuery } from '@apollo/client';
import { VIEWER_QUERY } from '../graphql/queries/queries.ts';

interface UserProviderProps {
  children: ReactNode;
}

const getUserState = () => {
  const authenticatedUser = Cookies.get('user-meta-data');

  if (authenticatedUser) {
    try {
      const decryptedData: ViewerQuery['viewer'] =
        decryptData(authenticatedUser);

      return {
        user: decryptedData,
        isLoggedIn: true,
      };
    } catch (error) {
      console.error(error);
    }
  }
  return { user: null, isLoggedIn: false };
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, getUserState());

  const authenticatedUser = Cookies.get('user-meta-data');

  const { error } = useQuery<ViewerQuery>(VIEWER_QUERY, {
    skip: !authenticatedUser,
    pollInterval: 60000,
    onCompleted: (data) => {
      if (data && data.viewer) {
        const currentData: ViewerQuery['viewer'] =
          decryptData(authenticatedUser);
        const fetchedData = data.viewer;

        if (JSON.stringify(fetchedData) !== JSON.stringify(currentData)) {
          dispatch({ type: 'SET_USER', payload: fetchedData });
          const newEncryptedData = encryptData(fetchedData);
          Cookies.set('user-meta-data', newEncryptedData, {
            expiresIn: '3h',
            sameSite: 'strict',
          });
        }
      }
    },
  });

  if (authenticatedUser && error) {
    throw new Error(`failed to fetch user data ${error}`);
  }

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
