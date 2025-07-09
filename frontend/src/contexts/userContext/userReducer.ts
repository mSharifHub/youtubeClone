import { CreatePostMutation, ViewerQuery } from '../../graphql/types.ts';

export interface UserState {
  user: ViewerQuery['viewer'] | null;
  isLoggedIn: undefined | boolean;
}

export type UserAction = { type: 'SET_USER'; payload: ViewerQuery['viewer'] } | { type: 'CLEAR_USER' } | { type: 'CREATE_POST'; payload: CreatePostMutation['createPost']['post'] };

export const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        user: action.payload,
        isLoggedIn: true,
      };

    case 'CLEAR_USER':
      return {
        user: null,
        isLoggedIn: false,
      };

    case 'CREATE_POST':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user!,
          posts: [action.payload, ...state.user.posts],
        },
      };

    default:
      return state;
  }
};
