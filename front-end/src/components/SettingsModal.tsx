import React, { useRef } from 'react';
import Portal from './helpers/Portal.ts';
import { useClickOutside } from './hooks/useClickOutside.ts';
import { useTheme } from '../darkModeContext/ThemeContext.ts';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { useUser } from '../userContext/UserContext.tsx';
import { Link } from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGoogle} from '@fortawesome/free-brands-svg-icons';


interface LoginModalProps {
  isOpen: boolean;
  onClickOutside: () => void;
  position: DOMRect | undefined;
}

export const SettingsModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClickOutside,
  position,
}) => {
  const { setTheme, theme, isDarkMode, darkModeText } = useTheme();

  const {
    state: { user },
  } = useUser();

  const toggleDarkMode = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const modalRef = useRef<HTMLDivElement>(null);

  const pos = position
    ? {
        top: position.top + position.height,
        right: Math.min(position.right, position.width),
      }
    : {};

  useClickOutside(modalRef, onClickOutside, isOpen);

  return (
    <Portal>
      <div
        ref={modalRef}
        className="absolute bg-white dark:dark-modal drop-shadow-lg  min-h-96  flex-initial w-80 min-w-80 rounded-lg z-20"
        style={pos}
      >
        <div className="grid grid-rows-9">
          {/*row-1*/}
          <div className="row-span-1 row-start-1 border-b ">
            <div className="grid grid-cols-[0.25fr_1fr] space-x-5 px-4 py-4">
              {/*picture */}
              <div className="col-span-1 col-start-1 flex justify-start items-center">
                {user && user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={`${user.username}-profilePicture`}
                    className="rounded-full min-h-12 min-w-12 w-12 h-12"
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
          </div>
          {/*row-2*/}
          <div className="row-span-1 row-start-2 ">
            <div className="flex flex-col justify-center items-start border-b space-y-2 px-4 py-4 ">
              <button
                onClick={()=> window.location.href='https://myaccount.google.com/'}
                className="flex justify-center items-center space-x-4">
                <FontAwesomeIcon
                icon={faGoogle} size="lg"/>
                <span className="capitalize text-sm">google account</span>
              </button>
              <div>sign out</div>
            </div>
          </div>

          <div className="flex justify-start items-center space-x-4 row-start-4 row-span-1 capitalize text-sm f">
            <DarkModeSwitch onChange={toggleDarkMode} checked={isDarkMode} />
            <span> Appearance:{darkModeText}</span>
          </div>
        </div>
      </div>
    </Portal>
  );
};
