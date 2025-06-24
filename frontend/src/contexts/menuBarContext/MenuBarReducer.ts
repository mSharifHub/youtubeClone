export type ActionType = { type: 'HANDLE_MENU' } | { type: 'SYSTEM_TOGGLE_MENU' } | { type: 'USER_TOGGLE_MENU' } | { type: 'RESET_STATE_TOGGLE_MENU' };

export interface MenuState {
  toggler: boolean;
  menu: boolean;
  userInteracted: boolean;
}

export const initialMenuState: MenuState = {
  toggler: window.innerWidth < 1280,
  menu: false,
  userInteracted: false,
};

export const MenuBarReducer = (state: MenuState, action: ActionType): MenuState => {
  switch (action.type) {
    case 'HANDLE_MENU':
      return {
        ...state,
        menu: !state.menu,
      };

    case 'SYSTEM_TOGGLE_MENU':
      return {
        ...state,
        toggler: !state.toggler,
      };

    case 'USER_TOGGLE_MENU':
      return {
        ...state,
        toggler: !state.toggler,
        userInteracted: !state.userInteracted,
      };

    case 'RESET_STATE_TOGGLE_MENU':
      return {
        ...state,
        toggler: false,
      };

    default:
      return state;
  }
};
