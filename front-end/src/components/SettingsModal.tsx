import React, { useRef } from 'react';
import { useClickOutside } from './hooks/useClickOutside.ts';
import { useTheme } from '../darkModeContext/ThemeContext.ts';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { useUser } from '../userContext/UserContext.tsx';
import { Link } from 'react-router-dom';
import { useUserLogout } from './hooks/useUserLogout.ts';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGoogle} from '@fortawesome/free-brands-svg-icons';
import youtubeStudioIcon from "../assets/menu_bar_icons/youtube-studio.png"
import coin from "../assets/menu_bar_icons/coin.png"
import signOut from "../assets/menu_bar_icons/sign-out.png"
import settings from "../assets/menu_bar_icons/settings.png"


interface LoginModalProps {
  isOpen: boolean;
  onClickOutside: () => void;
}

export const SettingsModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClickOutside,
}) => {
  const { setTheme, theme, isDarkMode, darkModeText } = useTheme();

  const {
    state: { user, isLoggedIn },
  } = useUser();

  const toggleDarkMode = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const modalRef = useRef<HTMLDivElement>(null);



  const logout = useUserLogout();

  useClickOutside(modalRef, onClickOutside, isOpen);

  return (

      <div
        ref={modalRef}
        className="absolute  transition-transform ease-in-out duration-100  top-10 right-4 bg-white dark:dark-modal drop-shadow-lg min-h-fit  min-w-fit w-64 rounded-lg z-20"
      >
        <div className="grid grid-rows">
          {/*row-1 [ user profile picture , youtube handler, view channel] */}
          <section className={` ${!isLoggedIn ? "hidden" : "row-span-1 row-start-1 border-b"} `}>
            <div className="grid grid-cols-[0.25fr_1fr] space-x-5 px-4 py-4">
              {/*picture */}
              <div className="col-span-1 col-start-1 flex justify-start items-center">
                {user && user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={`${user.username}-profilePicture`}
                    className="rounded-full min-h-12 min-w-12 w-12 h-12 "
                  />
                ) : null}
              </div>
              {/*user name and youtubeHandler*/}
              <div className="col-span-1 col-start-2 flex flex-col justify-start items-start">
                <div className="flex justify-start items-center space-x-2">
                  <span>{user?.firstName}</span>
                  <span>{user?.lastName}</span>
                </div>
                <div className="flex justify-start items-center ">
                  @{user?.youtubeHandler}
                </div>

                <Link
                  to="#"
                  className="flex justify-start items-start text-blue-400 text-sm mt-3 cursor-pointer hover:text-blue-300 "
                >
                  View your channel
                </Link>
              </div>
            </div>
          </section>
          {/*row-2*/}
          <section className={` ${!isLoggedIn ? "hidden" : "row-span-1 row-start-2 border-b "}  text-sm`}>
            <div className=" flex flex-col justify-center items-start space-y-4 px-4 py-4">
              {/*google account*/}
              <button
                onClick={() => window.location.href = 'https://myaccount.google.com/'}
                className="flex w-full h-8  px-2 items-center space-x-4  rounded-lg transition-colors transform duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700">
                <FontAwesomeIcon
                  icon={faGoogle} size="lg" />
                <span className="capitalize text-sm">google account</span>
              </button>
              {/*log out*/}
              <button
                onClick={() => logout()}
                className="flex w-full h-8  px-2 items-center space-x-4  rounded-lg transition-colors transform duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700">
                <img src={signOut} alt="signOut" className=" min-h-5 min-w-5 w-5 h-5 dark:invert" />
                <h3 className="capitalize">sign out</h3>
              </button>
            </div>
          </section>
          {/* row 3 [ youtubeStudio, purchase and membership ]*/}
          <section className={` ${!isLoggedIn ? "hidden" : "row-span-1 row-start-3 border-b "} text-sm`}>
            <div className="flex flex-col justify-center items-start space-y-4 px-2 py-2">
              <button className="flex w-full h-8  px-2 items-center space-x-4  rounded-lg transition-colors transform duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700">
                <img src={youtubeStudioIcon} alt="youtube-studio" className=" min-h-7 min-w-7 w-7 h-7 dark:invert" />
                <span className="capitalize text-sm">youtube studio</span>
              </button>
              <button className="flex w-full h-8  px-2 items-center space-x-4  rounded-lg transition-colors transform duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700">
                <img src={coin} alt="purchase-and-memberships" className=" min-h-7 min-w-7 w-7 h-7 dark:invert" />
                <h3 className="capitalize whitespace-nowrap">purchases and membership</h3>
              </button>
            </div>
          </section>

          {/* row 4  [ dark mode, settings] */}
          <section className="row-span-1 row-start-4 text-sm mt-2">
            <div className="flex flex-col justify-center items-start space-y-4 px-2 py-2">
              <div className="flex w-full h-8  px-2 items-center space-x-4  rounded-lg transition-colors transform duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700">
                <DarkModeSwitch onChange={toggleDarkMode} checked={isDarkMode} style={{ height: "18px" }} />
                <h3 className="capitalize"> Appearance:{'\t'}{darkModeText}</h3>
              </div>
              <button className="flex w-full h-8  px-2 items-center space-x-4  rounded-lg transition-colors transform duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700">
                <img src={settings} alt="settings" className="min-h-7 min-w-7 w-7 h-7 dark:invert" />
                <h3 className="capitalize">settings</h3>
              </button>
            </div>

          </section>
        </div>
      </div>

  );
};
