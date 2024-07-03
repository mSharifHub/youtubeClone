import React, { ReactNode, useReducer } from 'react';
import UserContext from './UserContext';
import { userReducer } from './userReducer';
import { UserContextType, UserState, Action } from './interfaces';
import Cookies from 'js-cookie';
import { DeleteCookie, DeleteRefreshCookie } from '../graphql/queries.ts';
import { useMutation } from '@apollo/client';

const getUser = (): UserState => {
  const userCookie = Cookies.get('user');
  if (userCookie) {
    const user = JSON.parse(userCookie);
    return {
      user,
      isLoggedIn: !!user,
    };
  } else {
    return {
      user: null,
      isLoggedIn: false,
    };
  }
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const initialState = getUser();

  const [deleteTokenCookie] = useMutation(DeleteCookie);
  const [deleteRefreshTokenCookie] = useMutation(DeleteRefreshCookie);

  const [state, dispatch] = useReducer<React.Reducer<UserState, Action>>(
    userReducer,
    initialState,
  );

  const logout = async () => {
    try {
      await deleteTokenCookie();
      await deleteRefreshTokenCookie();
      Cookies.remove('user');
      dispatch({ type: 'LOG_OUT' });
    } catch (err) {
      console.log('Failed to delete cookie', err);
    }
  };

  const value: UserContextType = { state, dispatch, logout };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
