import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import SearchInput from '../components/forms/SearchInput';
import youtubeIconPath from '../assets/navigation_icons/youtube-logo.png';
import videoIconPath from '../assets/navigation_icons/add-video.png';
import bellIconPath from '../assets/navigation_icons/bell.png';
import userIconPath from '../assets/navigation_icons/user-icon.png';
import Microphone from './forms/Mircrophone.tsx';
import IconSearch from './forms/IconSearch.tsx';
import GoogleLoginModal from './GoogleLoginModal.tsx';
import { useUser } from '../userContext/UserContext.tsx';
import { useToolTip } from './hooks/useToolTip.ts';
import { ToolTip } from './helpers/ToolTip.tsx';
import { SettingsModal } from './SettingsModal.tsx';

export default function NavigationBar() {
  /**
   * @param{showGoogleLogin, setShowGoogleLogin} - handles visibility of the Google modal
   * @param { showSettingModal, setShowSettingModal} - handle visibility of the settings modal
   * @param{settingModalPos,setSettingModalPos} - update the settings modal position
   */

  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [settingModalPos, setSettingModalPos] = useState<DOMRect | undefined>(
    undefined,
  );
  const settingModalRef = useRef<HTMLDivElement | null>(null);

  /**
   * @param {updateSettingsModalPos} updates the state position
   */
  const updateSettingsModalPos = () => {
    if (settingModalRef.current) {
      const rect = settingModalRef.current.getBoundingClientRect();
      setSettingModalPos(rect);
    }
  };

  const {
    state: { isLoggedIn, user },
  } = useUser();

  const handleShowSettingModal = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setShowSettingModal(true);
  };

  const handleCloseSettingModal = () => {
    setShowSettingModal(false);
  };

  const { showTooltip, toolTipText, tooltipPosition } = useToolTip();

  const openGoogleModal = () => {
    setShowGoogleLogin(true);
  };
  const closeGoogleModal = () => {
    setShowGoogleLogin(false);
  };

  useEffect(() => {
    updateSettingsModalPos();
    window.addEventListener('resize', updateSettingsModalPos);
    return () => {
      window.removeEventListener('resize', updateSettingsModalPos);
    };
  }, []);

  return (
    <>
      <nav className="grid grid-cols-2 md:grid-cols-[0.5fr_1fr_0.5fr] grid-rows-1 h-10  justify-center items-center mb-2  mt-1  px-2  ">
        {/*left*/}
        <div className="col-span-1 col-start-1 row-start-1 row-span-1 flex justify-start items-center ">
          <div className="flex justify-center items-center mx-4 space-x-8">
            <FontAwesomeIcon
              icon={faBars}
              size="xl"
              className=" text-neutral-400"
            />
            <div className="flex justify-center items-center">
              <img
                src={youtubeIconPath}
                alt={youtubeIconPath.split('/').pop()?.split('.')[0]}
                className="h-10 w-10  min-w-10"
                title="Youtube Home"
              />
              <h3 className="hidden md:inline-block font-bold text-lg">
                YouTube
              </h3>
            </div>
          </div>
        </div>
        {/*middle*/}
        <div className="col-span-1 md:col-start-2 row-start-1 row-span-1 flex justify-center items-center">
          <SearchInput />
        </div>
        {/*right*/}
        <div className="col-span-1 col-start-2 md:col-start-3  row-start-1 row-span-1  flex justify-end items-center  space-x-4  ">
          {/*icon search*/}
          <div
            className="h-10 w-10 flex md:hidden justify-center items-center rounded-full transition-transform duration-150 ease-out hover:border-2 hover:bg-neutral-200 cursor-pointer"
            title="Search"
          >
            <IconSearch />
          </div>
          {/*microphone*/}
          <div
            title="Search With Voice"
            className="h-10 w-10 flex md:hidden justify-center items-center rounded-full transition-transform duration-150 ease-out hover:border-2 hover:bg-neutral-200 cursor-pointer"
          >
            <Microphone />
          </div>

          {isLoggedIn ? (
            <>
              {/* Add-video component content */}
              <div className="h-10 w-10 flex justify-center items-center rounded-full transition-transform duration-150 ease-out hover:border-2 hover:bg-neutral-200 cursor-pointer">
                <img
                  src={videoIconPath}
                  alt={videoIconPath.split('/').pop()?.split('.')[0]}
                  className="min-w-6 min-h-6 w-6 h-6"
                />
              </div>
              {/* bell component content */}
              <div className="h-10 w-10 flex justify-center items-center rounded-full transition-transform duration-150 ease-out hover:border-2 hover:bg-neutral-200 cursor-pointer">
                <img
                  src={bellIconPath}
                  alt={videoIconPath.split('/').pop()?.split('.')[0]}
                  className="min-w-6 min-h-6 w-6 h-6"
                />
              </div>
            </>
          ) : (
            <div
              ref={settingModalRef}
              className="cursor-pointer"
              title="settings"
              onClick={(e) => handleShowSettingModal(e)}
            >
              <FontAwesomeIcon icon={faEllipsisVertical} size="lg" />
            </div>
          )}

          {/* profile component content */}
          <div onClick={openGoogleModal}>
            {user && user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={`${user.username}-profilePicture`}
                className="rounded-full h-8 w-8"
              />
            ) : (
              <div
                className="flex justify-center items-center border rounded-full w-24  h-9 space-x-2  transition-colors transform duration-75 ease-out hover:bg-blue-100  cursor-pointer"
                title="Sign in with Google"
              >
                <div className="flex justify-center items-center border border-blue-400 rounded-full">
                  <img
                    src={userIconPath}
                    alt="user-icon"
                    className=" h-5 w-5  "
                  />
                </div>

                <span className="text-sm  font-semibold text-blue-400">
                  Sign in
                </span>
              </div>
            )}
          </div>
        </div>
        <ToolTip
          visible={showTooltip}
          text={toolTipText}
          position={tooltipPosition}
        />
      </nav>

      {!isLoggedIn && (
        <GoogleLoginModal
          isOpen={showGoogleLogin}
          onRequestClose={closeGoogleModal}
        />
      )}
      {showSettingModal && (
        <SettingsModal
          isOpen={showSettingModal}
          onClickOutside={handleCloseSettingModal}
          position={settingModalPos}
        />
      )}
    </>
  );
}
