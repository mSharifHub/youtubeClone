import React, { useRef } from 'react';
import Portal from './helpers/Portal.ts';
import { useClickOutside } from './hooks/useClickOutside.ts';
import { useTheme } from '../darkModeContext/ThemeContext.ts';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

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
