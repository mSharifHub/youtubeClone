import React, { useRef } from 'react';
import { useClickOutside } from '../hooks/useClickOutside.ts';
import { useTheme } from '../../contexts/darkModeContext/ThemeContext.ts';
import { useUser } from '../../contexts/userContext/UserContext.tsx';
import { NavLink } from 'react-router-dom';
import { useUserLogout } from '../hooks/useUserLogout.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faMoon } from '@fortawesome/free-regular-svg-icons';
import signOut from '../../assets/menu_bar_icons/sign-out.png';
import switchAccount from '../../assets/menu_bar_icons/switchAccounts.png';
import { useSettingsModal } from '../../contexts/SetttingsModalsContext/SettingsModalsContext.ts';

interface LoginModalProps {
  isOpen: boolean;
  onClickOutside: () => void;
}

export const SettingsModal: React.FC<LoginModalProps> = ({ isOpen, onClickOutside }) => {
  const { theme } = useTheme();

  const { dispatch: settingsModalDispatch } = useSettingsModal();

  const handleShowSubModel = (event: React.MouseEvent<HTMLDivElement>, content: string) => {
    settingsModalDispatch({ type: 'SET_SUB_MODAL_CONTENT', payload: content });
    settingsModalDispatch({ type: 'OPEN_SUB_SETTINGS_MODAL' });
    settingsModalDispatch({ type: 'CLOSE_SETTINGS_MODAL' });
    event.stopPropagation();
  };

  const {
    state: { user, isLoggedIn },
  } = useUser();

  const modalRef = useRef<HTMLDivElement>(null);

  const logout = useUserLogout();

  useClickOutside(modalRef, onClickOutside, isOpen);

  return (
    <>
      <div
        ref={modalRef}
        className="absolute  transition-transform ease-in-out duration-100  top-16 right-4 bg-white dark:dark-modal drop-shadow-lg min-h-fit  min-w-fit w-64 rounded-lg z-20"
      >
        <div className="grid grid-rows m-2 ">
          {/*row-1 [ user profile picture , youtube handler, view channel] */}
          <section className={` ${!isLoggedIn ? 'hidden' : 'row-span-1 row-start-1 border-b'} `}>
            <div className="grid grid-cols-[0.25fr_1fr] space-x-5 px-4 py-4">
              {/*picture */}
              <div className="col-span-1 col-start-1 flex justify-start items-center">
                {user && user.profilePicture ? (
                  <img src={user.profilePicture} alt={`${user.username}-profilePicture`} className="rounded-full min-h-12 min-w-12 w-12 h-12 " />
                ) : null}
              </div>
              {/*username and youtubeHandler*/}
              <div className="col-span-1 col-start-2 flex flex-col justify-start items-start">
                <div className="flex justify-start items-center space-x-2">
                  <span>{user?.firstName}</span>
                  <span>{user?.lastName}</span>
                </div>
                <div className="flex justify-start items-center ">@{user?.youtubeHandler}</div>

                <NavLink to={`@${user?.youtubeHandler}`} className="flex justify-start items-start text-blue-400 text-sm mt-3 cursor-pointer hover:text-blue-300 ">
                  View your channel
                </NavLink>
              </div>
            </div>
          </section>
          {/*row-2*/}
          <section className={` ${!isLoggedIn ? 'hidden' : 'row-span-1 row-start-2 border-b '}  text-sm`}>
            <div className=" flex flex-col justify-center items-start space-y-4 px-4 py-4">
              {/*google account*/}
              <button
                onClick={() => (window.location.href = 'https://myaccount.google.com/')}
                className="flex w-full h-10 px-2 items-center space-x-4  rounded-lg transition-colors transform duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <FontAwesomeIcon icon={faGoogle} className="min-h-6 min-w-6 w-6 h-6" />
                <span className="capitalize text-sm">google account</span>
              </button>
              {/*switch account*/}
              <div
                onClick={(e) => handleShowSubModel(e, 'SWITCH_ACCOUNTS')}
                title="Switch Accounts"
                className="relative flex w-full h-10  px-2 items-center space-x-4  rounded-lg transition-colors transform duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <img src={switchAccount} alt="switchAccount" className=" min-h-6 min-w-6 w-6 h-6 dark:invert" />
                <span className="capitalize text-sm">switch accounts</span>
                <FontAwesomeIcon icon={faChevronRight} className="text-lg" />
              </div>
              {/*log out*/}
              <div
                onClick={() => logout()}
                title="Log out"
                className="flex w-full h-10  px-2 items-center space-x-4  rounded-lg transition-colors transform duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <img src={signOut} alt="signOut" className=" min-h-6 min-w-6 w-6 h-6 dark:invert" />
                <h3 className="capitalize">sign out</h3>
              </div>
            </div>
          </section>

          {/* row 4  [ dark mode, settings] */}
          <section className="row-span-1 row-start-4 text-sm mt-2">
            <div className="flex flex-col justify-center items-start space-y-4 px-2 py-2">
              <div
                onClick={(e) => handleShowSubModel(e, 'THEME_MODE')}
                title="Theme Mode"
                className="flex w-full h-10 px-2 items-center space-x-4  rounded-lg transition-colors transform duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <FontAwesomeIcon icon={faMoon} className="text-lg" />
                <span className="capitalize">Appearance: {theme} </span>
                <FontAwesomeIcon icon={faChevronRight} className="text-lg" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
