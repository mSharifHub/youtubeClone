import React from 'react';
import { useUserLogin } from '../hooks/useUserLogin.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import SearchInput from '../forms/SearchInput.tsx';
import youtubeIconPath from '../../assets/navigation_icons/youtube-logo.png';
import Microphone from '../forms/Mircrophone.tsx';
import IconSearch from '../forms/IconSearch.tsx';
import { useUser } from '../../contexts/userContext/UserContext.tsx';
import { useMenuBar } from '../../contexts/menuBarContext/MenuBarContext.ts';
import { useSettingsModal } from '../../contexts/SetttingsModalsContext/SettingsModalsContext.ts';
import { useQuery } from '@apollo/client';
import { ViewerQuery } from '../../graphql/types.ts';
import { VIEWER_QUERY } from '../../graphql/queries/queries.ts';
import { UserAvatar } from '../userComponent/UserAvatar.tsx';
import { UserLoadingAvatar } from '../userComponent/UserLoadingAvatar.tsx';
import { CreateVideoComponent } from './CreateVideoComponent.tsx';
import { NotificationComponent } from './NotificationComponent.tsx';
import { NotLoggedInSettings } from './NotLoggedInSettings.tsx';
import { CreateVideoLoading } from './CreateVideoLoading.tsx';
import NotificationIconLoading from './NotificationIconLoading.tsx';
import { LoginComponent } from '../authenticationComponent/LoginComponent.tsx';

export default function NavigationBar() {
  const {
    state: { isLoggedIn, user },
  } = useUser();

  const { dispatch: settingModalDispatch } = useSettingsModal();

  const { dispatch: menuBarDispatch } = useMenuBar();

  const { loading } = useQuery<ViewerQuery>(VIEWER_QUERY, {});

  const handleShowSettingModal = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    console.log('clicked', event);
    settingModalDispatch({ type: 'OPEN_SETTINGS_MODAL' });
  };

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
        <div className="col-span-1 col-start-1 row-start-1 row-span-1 mx-4 flex justify-start items-center space-x-2 ">
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

          {loading ? (
            <>
              <CreateVideoLoading />
              <NotificationIconLoading />
            </>
          ) : isLoggedIn ? (
            <>
              <CreateVideoComponent />
              <NotificationComponent />
            </>
          ) : (
            <NotLoggedInSettings handleShowSettingModal={handleShowSettingModal} handleCloseSettingModal={handleCloseSettingModal} handleCloseSubModal={handleCloseSubModel} />
          )}

          {/* profile component content */}
          {loading ? (
            <UserLoadingAvatar />
          ) : isLoggedIn ? (
            <UserAvatar handleCloseSettingModal={handleCloseSettingModal} handleCloseSubModel={handleCloseSubModel} handleShowSettingModal={handleShowSettingModal} />
          ) : (
            <LoginComponent redirectGoogleAuth={redirectGoogleAuth} />
          )}
        </div>
      </nav>
    </>
  );
}
