import { useUser } from '../../contexts/userContext/UserContext.tsx';
import React from 'react';
import { useSettingsModal } from '../../contexts/SetttingsModalsContext/SettingsModalsContext.ts';
import { SettingsModal } from '../settingsComponents/SettingsModal.tsx';
import { SubModal } from '../settingsComponents/SubModal.tsx';
import { SwitchTheme } from '../settingsComponents/SwitchTheme.tsx';
import { SwitchAccount } from '../settingsComponents/SwitchAccount.tsx';

interface UserAvatarProps {
  handleShowSettingModal: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleCloseSettingModal: () => void;
  handleCloseSubModel: () => void;
}
export const UserAvatar: React.FC<UserAvatarProps> = ({ handleShowSettingModal, handleCloseSettingModal, handleCloseSubModel }) => {
  const {
    state: { user },
  } = useUser();

  const {
    state: { settingModalToggler, subSettingModalToggler, subModalContent },
  } = useSettingsModal();

  return (
    <div onClick={(e) => handleShowSettingModal(e)}>
      {user && user.profilePicture && <img src={user.profilePicture} alt="" className="rounded-full min-h-8 min-w-8 w-8 h-8 " />}
      {settingModalToggler && <SettingsModal isOpen={settingModalToggler} onClickOutside={handleCloseSettingModal} />}
      {subSettingModalToggler && subModalContent && (
        <SubModal isOpen={subSettingModalToggler} onClickOutside={handleCloseSubModel}>
          {subModalContent === 'SWITCH_ACCOUNTS' && <SwitchAccount />}
          {subModalContent === 'THEME_MODE' && <SwitchTheme />}
        </SubModal>
      )}
    </div>
  );
};
