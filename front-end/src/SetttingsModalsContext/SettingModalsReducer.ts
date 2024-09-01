export type ActionType =
  | { type: 'OPEN_SETTINGS_MODAL' }
  | { type: 'OPEN_SUB_SETTINGS_MODAL' }
  | { type: 'CLOSE_SETTINGS_MODAL' }
  | { type: 'CLOSE_SUB_SETTINGS_MODAL' };

export interface SettingModalsState {
  settingModalToggler: boolean;
  subSettingModalToggler: boolean;
}

export const initialSettingsModalState: SettingModalsState = {
  settingModalToggler: false,
  subSettingModalToggler: false,
};

export const SettingModalsReducer = (
  state: SettingModalsState,
  action: ActionType,
): SettingModalsState => {
  switch (action.type) {
    case 'OPEN_SETTINGS_MODAL':
      return {
        ...state,
        settingModalToggler: true,
      };

    case 'CLOSE_SETTINGS_MODAL':
      return {
        ...state,
        settingModalToggler: false,
      };

    case 'CLOSE_SUB_SETTINGS_MODAL':
      return {
        ...state,
        subSettingModalToggler: false,
      };

    case 'OPEN_SUB_SETTINGS_MODAL':
      return {
        ...state,
        subSettingModalToggler: true,
      };

    default:
      return state;
  }
};
