import { createContext, Dispatch, useContext } from 'react';
import { UserState, UserAction } from './userReducer.ts';

interface UserContextType {
  state: UserState;
  dispatch: Dispatch<UserAction>;
  loadingQuery: boolean;
  errorQuery: null | string;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within useContext');
  }

  return context;
};
