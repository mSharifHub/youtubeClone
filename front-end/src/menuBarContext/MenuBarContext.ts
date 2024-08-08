import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export interface MenuBarContextProp {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
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
