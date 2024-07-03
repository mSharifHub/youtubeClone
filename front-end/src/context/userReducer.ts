import { Action, UserState } from './interfaces.ts';
import Cookies from 'js-cookie';

export const userReducer = (state: UserState, action: Action) => {
  switch (action.type) {
    case 'SET_USER': {
      const user = action.payload;
      Cookies.set('user', JSON.stringify(user), { expires: 7 }); // adds user state to cookie
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


