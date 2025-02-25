export type ActionType =
  | { type: 'OPEN_SETTINGS_MODAL' }
  | { type: 'OPEN_SUB_SETTINGS_MODAL' }
  | { type: 'CLOSE_SETTINGS_MODAL' }
  | { type: 'CLOSE_SUB_SETTINGS_MODAL' }
  | { type: 'SET_SUB_MODAL_CONTENT'; payload: string | null };

export interface SettingModalsState {
  settingModalToggler: boolean;
  subSettingModalToggler: boolean;
  subModalContent: string | null;
}

export const initialSettingsModalState: SettingModalsState = {
  settingModalToggler: false,
  subSettingModalToggler: false,
  subModalContent: null,
};

export const SettingModalsReducer = (state: SettingModalsState, action: ActionType): SettingModalsState => {
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

    case 'SET_SUB_MODAL_CONTENT':
      return {
        ...state,
        subModalContent: action.payload,
      };

    default:
      return state;
  }
};
