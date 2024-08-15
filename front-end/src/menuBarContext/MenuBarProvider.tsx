import React, { ReactNode, useEffect, useReducer, useState } from 'react';
import { MenuBarContext } from './MenuBarContext.ts';
import { initialMenuState, MenuBarReducer } from './MenuBarReducer.ts';
import { useThrottle } from '../components/hooks/useThrottle.ts';

export const MenuBarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(MenuBarReducer, initialMenuState);

  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const handleResize = useThrottle(() => {
    setWindowWidth(window.innerWidth);
  }, 800);

  // throttle function for the resize
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  //  closes menu bar
  useEffect(() => {
    if (windowWidth < 1280 && !state.toggler) {
      dispatch({ type: 'HANDLE_TOGGLE_MENU' });
    }
    return () => {
      if (windowWidth > 1280 && state.toggler) {
        dispatch({ type: 'RESET_STATE_TOGGLE_MENU' });
      }
    };
  }, [state.toggler, windowWidth]);

  return (
    <MenuBarContext.Provider value={{ state, dispatch }}>
      {children}
    </MenuBarContext.Provider>
  );
};
