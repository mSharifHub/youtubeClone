import React, { ReactNode, useReducer } from 'react';
import UserContext from './UserContext';
import { userReducer } from './userReducer';
import { UserContextType, UserState, Action } from './interfaces';
import Cookies from 'js-cookie';

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

  const [state, dispatch] = useReducer<React.Reducer<UserState, Action>>(
    userReducer,
    initialState,
  );

  const logout = () => {
    Cookies.remove('JWT');
    Cookies.remove('JWT-refresh-token');
    Cookies.remove('user');
    dispatch({ type: 'LOG_OUT' });
  };

  const value: UserContextType = { state, dispatch, logout };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
