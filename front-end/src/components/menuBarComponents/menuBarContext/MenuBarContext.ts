import { createContext, Dispatch, useContext } from 'react';
import { MenuState, ActionType } from './MenuBarReducer.ts';

export interface MenuBarContextProp {
  state: MenuState;
  dispatch: Dispatch<ActionType>;
}

export const MenuBarContext = createContext<MenuBarContextProp | undefined>(
  undefined,
);

export const useMenuBar = () => {
  const context = useContext(MenuBarContext);

  if (!context) {
    throw new Error('useMenuBar must be used within ThemeProvider');
  }

  return context;
};
