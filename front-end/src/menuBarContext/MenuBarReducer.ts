export type ActionType = { type: 'HANDLE_MENU' };

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
  const isLargeScreen = window.matchMedia('(min-width: 1280px)').matches;
  const isSmallScreen = window.matchMedia('(max-width: 1279px)').matches;

  switch (action.type) {
    case 'HANDLE_MENU':
      return {
        toggler: isLargeScreen ? !state.toggler : false,
        menu: isSmallScreen? !state.menu : false,
      };

    default:
      return state;
  }
};
