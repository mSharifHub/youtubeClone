import React, { ReactNode, useReducer } from 'react';
import {
  initialSettingsModalState,
  SettingModalsReducer,
} from './SettingModalsReducer.ts';
import { SettingModalsContext } from './SettingsModalsContext.ts';

export const SettingModalsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(
    SettingModalsReducer,
    initialSettingsModalState,
  );

  return (
    <SettingModalsContext.Provider value={{ state, dispatch }}>
      {children}
    </SettingModalsContext.Provider>
  );
};
