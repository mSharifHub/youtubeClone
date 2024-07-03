import React from 'react';

export interface User {
  username: string;
  profilePicture?: string;
  bio?: string;
  isVerified: boolean;
  email: string;
  subscribers: { username: string }[];
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

export interface Action {
  type: string;
  payload?: any; // change this later
}
