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
  }, 150);

  // throttle function for the resize
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Closes menu bar
  useEffect(() => {
    if (!state.userInteracted && !state.toggler && windowWidth < 1280) {
      dispatch({ type: 'SYSTEM_TOGGLE_MENU' });
    }

    return () => {
      if (!state.userInteracted && state.toggler && windowWidth > 1280) {
        dispatch({ type: 'RESET_STATE_TOGGLE_MENU' });
      }
    };
  }, [state.toggler, state.userInteracted, windowWidth]);

  useEffect(() => {
    if (windowWidth > 1280) {
      dispatch({ type: 'RESET_STATE_MENU' });
    }
  }, [windowWidth]);

  return (
    <MenuBarContext.Provider value={{ state, dispatch }}>
      {children}
    </MenuBarContext.Provider>
  );
};
