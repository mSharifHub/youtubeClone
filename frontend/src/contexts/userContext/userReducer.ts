import { ViewerQuery } from '../../graphql/types.ts';

export interface UserState {
  user: ViewerQuery['viewer'] | null;
  isLoggedIn: undefined | boolean;
}

export type UserAction = { type: 'SET_USER'; payload: ViewerQuery['viewer'] } | { type: 'CLEAR_USER' };

export const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
      };
    case 'CLEAR_USER':
      return {
        user: null,
        isLoggedIn: false,
      };

    default:
      return state;
  }
};
