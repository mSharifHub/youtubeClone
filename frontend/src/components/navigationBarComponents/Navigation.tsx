import React from 'react';
import { useUserLogin } from '../hooks/useUserLogin.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
import SearchInput from '../forms/SearchInput.tsx';
import youtubeIconPath from '../../assets/navigation_icons/youtube-logo.png';
import videoIconPath from '../../assets/navigation_icons/add-video.png';
import bellIconPath from '../../assets/navigation_icons/bell.png';
import userIconPath from '../../assets/navigation_icons/user-icon.png';
import Microphone from '../forms/Mircrophone.tsx';
import IconSearch from '../forms/IconSearch.tsx';
import { useUser } from '../../contexts/userContext/UserContext.tsx';
import { SettingsModal } from '../settingsComponents/SettingsModal.tsx';
import { useMenuBar } from '../../contexts/menuBarContext/MenuBarContext.ts';
import { useSettingsModal } from '../../contexts/SetttingsModalsContext/SettingsModalsContext.ts';
import { SubModal } from '../settingsComponents/SubModal.tsx';
import { SwitchAccount } from '../settingsComponents/SwitchAccount.tsx';
import { SwitchTheme } from '../settingsComponents/SwitchTheme.tsx';

export default function NavigationBar() {
  // user state context to display the user data on the navigation component
  const {
    state: { isLoggedIn, user },
  } = useUser();

  const {
    state: { settingModalToggler, subSettingModalToggler, subModalContent },
    dispatch: settingModalDispatch,
  } = useSettingsModal();

  // dispatch for menu bar
  const { dispatch: menuBarDispatch } = useMenuBar();

  // function to be passed as prop to settings modal component
  const handleShowSettingModal = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    settingModalDispatch({ type: 'OPEN_SETTINGS_MODAL' });
  };

  /*
   *
   * This functions handles the settings state. The Settings modal
   * needs to be used as a children of the html tag
   */
  const handleCloseSettingModal = () => {
    settingModalDispatch({ type: 'CLOSE_SETTINGS_MODAL' });
  };

  const handleCloseSubModel = () => {
    settingModalDispatch({ type: 'CLOSE_SUB_SETTINGS_MODAL' });
  };

  // function to change context state based on the screen size
  const handleMenu = () => {
    const isLargeScreen = window.matchMedia('(min-width: 1280px)').matches;
    const isSmallScreen = window.matchMedia('(max-width: 1279px)').matches;

    if (isLargeScreen) {
      menuBarDispatch({ type: 'USER_TOGGLE_MENU' });
    }

    if (isSmallScreen) {
      menuBarDispatch({ type: 'HANDLE_MENU' });
    }
  };

  // function to redirect user to login user google API and backend  end point
  const { redirectGoogleAuth } = useUserLogin();

  return (
    <>
      <nav className="grid grid-cols-2 md:grid-cols-[0.5fr_1fr_0.5fr] grid-rows-1 h-10  justify-center items-center mb-2  mt-1 ">
        {/*left side of the navigation bar*/}
        <div className="col-span-1 col-start-1 row-start-1 row-span-1 mx-4 flex justify-start items-center space-x-2">
          {/* fa-bars to show or hide side menu */}
          <FontAwesomeIcon
            icon={faBars}
            onClick={handleMenu}
            title="Menu Bar"
            className="h-[20px] w-[20px] p-2 flex justify-center items-center rounded-full  transition-transform duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700  cursor-pointer  "
          />
          {/* YouTube Icon to page redirect to home page */}
          <div onClick={() => (window.location.href = '/')} title="Youtube Home" className="flex justify-center items-center cursor-pointer space-x-1">
            <img src={youtubeIconPath} alt={youtubeIconPath.split('/').pop()?.split('.')[0]} className="h-9 w-19  min-w-9" />
          </div>
        </div>
        {/*middle of the navigation bar e*/}
        <div className="col-span-1 md:col-start-2 row-start-1 row-span-1 flex justify-center items-center">
          <SearchInput />
        </div>
        {/*right side of the navigation bar*/}
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
              <div className="h-10 w-28  min-w-28  rounded-full transition-transform duration-150 ease-out  bg-neutral-100 hover:bg-neutral-200   dark:bg-neutral-800 dark:hover:bg-neutral-700  cursor-pointer ">
                <div className=" h-full w-full flex justify-center  items-center space-x-2 transition-transform duration-75 ease-in-out  hover:scale-110 ">
                  <FontAwesomeIcon icon={faPlus} />
                  <h1 className="text-sm font-semibold">Create</h1>
                </div>
              </div>
              {/* bell component content */}
              <div className="h-8 w-8 min-w-8 flex justify-center items-center rounded-full transition-transform duration-150 ease-out  hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer ">
                <img src={bellIconPath} title="Alerts" alt={videoIconPath.split('/').pop()?.split('.')[0]} className="min-w-6 min-h-6 w-6 h-6 dark:invert" />
              </div>
            </>
          ) : (
            <>
              {/* settings  if icon when not logged in  */}
              <div className="cursor-pointer" title="settings" onClick={(e) => handleShowSettingModal(e)}>
                <FontAwesomeIcon icon={faEllipsisVertical} size="lg" />
                {/* Use component settings within the  html tag */}
                {settingModalToggler && <SettingsModal isOpen={settingModalToggler} onClickOutside={handleCloseSettingModal} />}
                {/* subModal component */}
                {subSettingModalToggler && subModalContent && (
                  <SubModal isOpen={subSettingModalToggler} onClickOutside={handleCloseSubModel}>
                    {subModalContent === 'SWITCH_ACCOUNTS' && <SwitchAccount />}
                    {subModalContent === 'THEME_MODE' && <SwitchTheme />}
                  </SubModal>
                )}
              </div>
            </>
          )}

          {/* profile component content */}
          <div onClick={() => (!isLoggedIn ? redirectGoogleAuth() : null)}>
            {user && user.profilePicture ? (
              <div onClick={(e) => handleShowSettingModal(e)} className="cursor-pointer relative" title="User Account">
                <img src={user.profilePicture} alt={`${user.username}-profilePicture`} className="rounded-full min-h-8 min-w-8 w-8 h-8" />
                {/* Use component settings within the  html tag */}
                {settingModalToggler && <SettingsModal isOpen={settingModalToggler} onClickOutside={handleCloseSettingModal} />}
                {/* subModal component */}
                {subSettingModalToggler && subModalContent && (
                  <SubModal isOpen={subSettingModalToggler} onClickOutside={handleCloseSubModel}>
                    {subModalContent === 'SWITCH_ACCOUNTS' && <SwitchAccount />}
                    {subModalContent === 'THEME_MODE' && <SwitchTheme />}
                  </SubModal>
                )}
              </div>
            ) : (
              <div
                className="flex justify-center items-center border dark:border-neutral-700 rounded-full w-24  h-9 space-x-2  transition-colors transform duration-75 ease-out hover:bg-blue-100 dark:hover:bg-neutral-700  cursor-pointer"
                title="Sign in with Google"
              >
                <div className="flex justify-center items-center border border-blue-400 rounded-full ">
                  <img src={userIconPath} alt="user-icon" className=" h-5 w-5  " />
                </div>
                <span className="text-sm  font-semibold text-blue-400 ">Sign in</span>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
