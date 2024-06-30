import { Action, UserState } from './interfaces.ts';

export const userReducer = (state: UserState, action: Action) => {
  switch (action.type) {
    case 'SET_USER': {
      const user = action.payload;
      localStorage.setItem('user', JSON.stringify(user));
      return {
        ...state,
        user,
        isLoggedIn: !!user,
      };
    }
    case 'LOG_OUT': {
      return {
        ...state,
        user: null,
        isLoggedIn: false,
      };
    }

    default:
      return state;
  }
};
