import { ActionType, SettingModalsState } from './SettingModalsReducer.ts';
import { createContext, Dispatch, useContext } from 'react';

export interface SettingsModalsContextProp {
  state: SettingModalsState;
  dispatch: Dispatch<ActionType>;
}

export const SettingModalsContext = createContext<
  SettingsModalsContextProp | undefined
>(undefined);

export const useSettingsModal = () => {
  const context = useContext(SettingModalsContext);

  if (!context) {
    throw new Error('useSettingsModal must be used within SettingsProvider');
  }

  return context;
};
