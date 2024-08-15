export type ActionType =
  | { type: 'HANDLE_MENU' }
  | { type: 'HANDLE_TOGGLE_MENU' }
  | { type: 'RESET_STATE_TOGGLE_MENU' }
  | { type: 'RESET_STATE_MENU' };

export interface MenuState {
  toggler: boolean;
  menu: boolean;
}

export const initialMenuState: MenuState = {
  toggler: false,
  menu: false,
};

export const MenuBarReducer = (
  state: MenuState,
  action: ActionType,
): MenuState => {
  switch (action.type) {
    case 'HANDLE_MENU':
      return {
        ...state,
        menu: !state.menu,
      };

    case 'RESET_STATE_MENU':
      return {
        ...state,
        menu: initialMenuState.menu,
      };

    case 'HANDLE_TOGGLE_MENU':
      return {
        ...state,
        toggler: !state.toggler,
      };
    case 'RESET_STATE_TOGGLE_MENU':
      return {
        ...state,
        toggler: initialMenuState.toggler,
      };

    default:
      return state;
  }
};
