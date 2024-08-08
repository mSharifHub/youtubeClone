import React, { useState, ReactNode } from 'react';
import { MenuBarContext, MenuBarContextProp } from './MenuBarContext.ts';

export const MenuBarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [show, setShow] = useState(false);

  const value: MenuBarContextProp = { show, setShow };

  return (
    <MenuBarContext.Provider value={value}>{children}</MenuBarContext.Provider>
  );
};
