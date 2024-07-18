import React, { useEffect, useRef, useState } from 'react';
import Portal from './helpers/Portal.ts';
import { useClickOutside } from './hooks/useClickOutside.ts';
import { Theme, useTheme } from '../darkModeContext/ThemeContext.ts';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

interface LoginModalProps {
  isOpen: boolean;
  onClickOutside: () => void;
  position: DOMRect | undefined;
}

/**
 *
 * @param isOpen  Checks if the modal is open
 * @param onClickOutside  Calls the function on navigation to change the modal visibility state to false
 * @param{useClickOutside} hook  to that uses the modal ref to detect click events outside the modal
 */
export const SettingsModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClickOutside,
  position,
}) => {
  const { setTheme, theme } = useTheme();
  const [darkModeText, setDarkModeText] = useState<Theme>(theme);
  const [isDarkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setDarkModeText(newTheme);
  };

  const modalRef = useRef<HTMLDivElement>(null);

  const pos = position
    ? { top: position.top + 30, left: position.left - 200 }
    : {};

  useClickOutside(modalRef, onClickOutside, isOpen);

  useEffect(() => {
    theme === 'dark' ? setDarkMode(true) : setDarkMode(false);
  }, [theme]);

  return (
    <Portal>
      <div
        ref={modalRef}
        className="absolute bg-white dark:dark-modal drop-shadow-lg h-80  flex-initial w-64 rounded-lg z-20"
        style={pos}
      >
        <div className="grid grid-rows-9 mx-4">
          <div className="flex justify-start items-center space-x-4 row-start-2 row-span-1 capitalize text-sm f">
            <DarkModeSwitch onChange={toggleDarkMode} checked={isDarkMode} />
            <span> Appearance: {darkModeText}</span>
          </div>
        </div>
      </div>
    </Portal>
  );
};
