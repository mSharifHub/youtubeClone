import React, { ReactNode, useReducer } from 'react';
import { MenuBarContext } from './MenuBarContext.ts';
import { initialMenuState, MenuBarReducer } from './MenuBarReducer.ts';

export const MenuBarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(MenuBarReducer, initialMenuState);

  return (
    <MenuBarContext.Provider value={{ state, dispatch }}>
      {children}
    </MenuBarContext.Provider>
  );
};
