import React, { ReactNode, useReducer } from 'react';
import UserContext from './UserContext';
import { userReducer } from './userReducer';
import { UserContextType, UserState, User, Action } from './interfaces';

const getUserFromLocalStorage = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const initialState: UserState = {
    user: getUserFromLocalStorage(),
    isLoggedIn: !!localStorage.getItem('token'),
  };

  const [state, dispatch] = useReducer<React.Reducer<UserState, Action>>(
    userReducer,
    initialState,
  );

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    dispatch({ type: 'LOG_OUT' });
  };

  const value: UserContextType = { state, dispatch, logout };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
