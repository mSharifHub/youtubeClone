import React, { useRef, useState } from 'react';
import Portal from './helpers/Portal.ts';
import { useClickOutside } from './hooks/useClickOutside.ts';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { Theme, useTheme } from '../darkModeContext/ThemeContext.ts';

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
  const [isDarkModeIcon, setDarkModeIcon] = useState<boolean>(false);
  const [darkModeText, setDarkModeText] = useState<Theme>(theme);

  const toggleDarkMode = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setDarkModeIcon(checked);
    setDarkModeText(newTheme);
    setTheme(newTheme);
  };

  const modalRef = useRef<HTMLDivElement>(null);

  const pos = position
    ? { top: position.top + 30, left: position.left - 200 }
    : {};

  useClickOutside(modalRef, onClickOutside, isOpen);

  return (
    <Portal>
      <div
        ref={modalRef}
        className="absolute bg-white dark:bg-neutral-700 drop-shadow-lg h-80  flex-initial w-64 rounded-lg z-20"
        style={pos}
      >
        <div className="grid grid-rows-9 mx-4">
          <div className="flex justify-start items-center space-x-4 row-start-2 row-span-1 capitalize text-sm f">
            <DarkModeSwitch
              checked={isDarkModeIcon}
              onChange={toggleDarkMode}
              size={20}
            />
            <span> Appearance: {darkModeText}</span>
          </div>
        </div>
      </div>
    </Portal>
  );
};
