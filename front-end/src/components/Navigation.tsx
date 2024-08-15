import React, { useState } from 'react';
import { useUserLogin } from './hooks/useUserLogin.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import SearchInput from '../components/forms/SearchInput';
import youtubeIconPath from '../assets/navigation_icons/youtube-logo.png';
import videoIconPath from '../assets/navigation_icons/add-video.png';
import bellIconPath from '../assets/navigation_icons/bell.png';
import userIconPath from '../assets/navigation_icons/user-icon.png';
import Microphone from './forms/Mircrophone.tsx';
import IconSearch from './forms/IconSearch.tsx';
import { useUser } from '../userContext/UserContext.tsx';
import { useToolTip } from './hooks/useToolTip.ts';
import { ToolTip } from './helpers/ToolTip.tsx';
import { SettingsModal } from './SettingsModal.tsx';
import { useMenuBar } from '../menuBarContext/MenuBarContext.ts';


export default function NavigationBar() {
  const [showSettingModal, setShowSettingModal] = useState(false);


  const {
    state: { isLoggedIn, user },
  } = useUser();

  const { dispatch, state} = useMenuBar();

  const handleShowSettingModal = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setShowSettingModal(true);
  };

  const handleCloseSettingModal = () => {
    setShowSettingModal(false);
  };



  const handleMenu = () => {
    const isLargeScreen = window.matchMedia('(min-width: 1280px)').matches;
    const isSmallScreen = window.matchMedia('(max-width: 1279px)').matches;

    if (isLargeScreen) {
      dispatch({ type: 'HANDLE_TOGGLE_MENU' });
    }

    if (isSmallScreen) {
      dispatch({ type: 'HANDLE_MENU' });
    }
  };

  const { redirectGoogleAuth } = useUserLogin();

  const { showTooltip, toolTipText, tooltipPosition } = useToolTip();





  return (
    <>
      <nav className="grid grid-cols-2 md:grid-cols-[0.5fr_1fr_0.5fr] grid-rows-1 h-10  justify-center items-center mb-2  mt-1 ">
        {/*left*/}
        <div className="col-span-1 col-start-1 row-start-1 row-span-1 mx-4 flex justify-start items-center space-x-4">
          {/* fa-bars */}

          <FontAwesomeIcon
            icon={faBars}
            onClick={handleMenu}
            title="Menu Bar"
            className="h-[20px] w-[20px] p-2 flex justify-center items-center rounded-full  transition-transform duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700  cursor-pointer  "
          />

          <div
            onClick={() => (window.location.href = '/')}
            title="Youtube Home"
            className="flex justify-center items-center cursor-pointer"
          >
            <img
              src={youtubeIconPath}
              alt={youtubeIconPath.split('/').pop()?.split('.')[0]}
              className="h-8 w-8  min-w-8"
            />
            <h3 className="flex justify-center items-center font-bold text-sm scale-y-[180%]">
              YouTube
            </h3>
          </div>
        </div>
        {/*middle*/}
        <div className="col-span-1 md:col-start-2 row-start-1 row-span-1 flex justify-center items-center">
          <SearchInput />
        </div>
        {/*right*/}
        <div className="col-span-1 col-start-2 md:col-start-3  row-start-1 row-span-1  flex justify-end mx-4 items-center space-x-3">
          {/*icon search*/}
          <div
            className="h-8 w-8 min-w-8 flex md:hidden justify-center items-center rounded-full transition-transform duration-150 ease-out  hover:bg-neutral-200  dark:hover:bg-neutral-700 cursor-pointer"
            title="Search"
          >
            <IconSearch />
          </div>
          {/*microphone*/}
          <div
            title="Search With Voice"
            className="h-8 w-8 min-w-8 flex md:hidden justify-center items-center rounded-full transition-transform duration-150 ease-out  hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
          >
            <Microphone />
          </div>

          {isLoggedIn ? (
            <>
              {/* Add-video component content */}
              <div className="h-8 w-8 min-w-8 flex justify-center items-center rounded-full transition-transform duration-150 ease-out  hover:bg-neutral-200 dark:hover:bg-neutral-700  cursor-pointer ">
                <img
                  src={videoIconPath}
                  alt={videoIconPath.split('/').pop()?.split('.')[0]}
                  className="min-w-6 min-h-6 w-6 h-6 dark:invert"
                />
              </div>
              {/* bell component content */}
              <div className="h-8 w-8 min-w-8 flex justify-center items-center rounded-full transition-transform duration-150 ease-out  hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer ">
                <img
                  src={bellIconPath}
                  alt={videoIconPath.split('/').pop()?.split('.')[0]}
                  className="min-w-6 min-h-6 w-6 h-6 dark:invert"
                />
              </div>
            </>
          ) : (
            <>
              {/* settings  if icon when not logged in  */}
              <div
                className="cursor-pointer"
                title="settings"
                onClick={(e) => handleShowSettingModal(e)}
              >
                <FontAwesomeIcon icon={faEllipsisVertical} size="lg" />
              </div>
            </>
          )}

          {/* profile component content */}
          <div onClick={() => (!isLoggedIn ? redirectGoogleAuth() : null)}>
            {user && user.profilePicture ? (
              <div
                onClick={(e) => handleShowSettingModal(e)}
                className="cursor-pointer border relative"
              >
                <img
                  src={user.profilePicture}
                  alt={`${user.username}-profilePicture`}
                  className="rounded-full min-h-8 min-w-8 w-8 h-8"
                />
                {showSettingModal && (
                  <SettingsModal
                    isOpen={showSettingModal}
                    onClickOutside={handleCloseSettingModal}
                  />
                )}
              </div>
            ) : (
              <div
                className="flex justify-center items-center border dark:border-neutral-700 rounded-full w-24  h-9 space-x-2  transition-colors transform duration-75 ease-out hover:bg-blue-100 dark:hover:bg-neutral-700  cursor-pointer"
                title="Sign in with Google"
              >
                <div className="flex justify-center items-center border border-blue-400 rounded-full ">
                  <img
                    src={userIconPath}
                    alt="user-icon"
                    className=" h-5 w-5  "
                  />
                </div>

                <span className="text-sm  font-semibold text-blue-400 ">
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
    </>
  );
}
