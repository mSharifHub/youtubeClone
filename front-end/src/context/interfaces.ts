import React from 'react';

export interface User {
  username: string;
  profilePicture?: string;
  bio?: string;
  isVerified: boolean;
  email: string;
  subscribers: { username: string };
}

export interface UserState {
  user: User | null;
  isLoggedIn: boolean;
}

export interface UserContextType {
  state: UserState;
  dispatch: React.Dispatch<Action>;
  logout: () => void;
}

export type Action = { type: 'SET_USER'; payload: User } | { type: 'LOG_OUT' };
