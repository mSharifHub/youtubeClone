import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { SettingsModal } from '../settingsComponents/SettingsModal.tsx';
import { SubModal } from '../settingsComponents/SubModal.tsx';
import { SwitchAccount } from '../settingsComponents/SwitchAccount.tsx';
import { SwitchTheme } from '../settingsComponents/SwitchTheme.tsx';
import { useSettingsModal } from '../../contexts/SetttingsModalsContext/SettingsModalsContext.ts';

interface NotLoggedInSettingsProps {
  handleShowSettingModal: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleCloseSettingModal: () => void;
  handleCloseSubModal: () => void;
}

export const NotLoggedInSettings: React.FC<NotLoggedInSettingsProps> = ({ handleShowSettingModal, handleCloseSettingModal, handleCloseSubModal }) => {
  const {
    state: { settingModalToggler, subSettingModalToggler, subModalContent },
  } = useSettingsModal();

  return (
    <div className="cursor-pointer" title="settings" onClick={(e) => handleShowSettingModal(e)}>
      <FontAwesomeIcon icon={faEllipsisVertical} size="lg" />
      {/* Use component settings within the  html tag */}
      {settingModalToggler && <SettingsModal isOpen={settingModalToggler} onClickOutside={handleCloseSettingModal} />}
      {/* subModal component */}
      {subSettingModalToggler && subModalContent && (
        <SubModal isOpen={subSettingModalToggler} onClickOutside={handleCloseSubModal}>
          {subModalContent === 'SWITCH_ACCOUNTS' && <SwitchAccount />}
          {subModalContent === 'THEME_MODE' && <SwitchTheme />}
        </SubModal>
      )}
    </div>
  );
};
