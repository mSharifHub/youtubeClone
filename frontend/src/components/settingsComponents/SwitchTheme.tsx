import React from 'react';
import { JSX } from 'react/jsx-runtime';
import { useSettingsModal } from './SetttingsModalsContext/SettingsModalsContext.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from './darkModeContext/ThemeContext.ts';
import { Theme } from './darkModeContext/ThemeContext.ts';

export const SwitchTheme: React.FC = (): JSX.Element => {
  const { dispatch: settingsModalDispatch } = useSettingsModal();

  const { setTheme, theme } = useTheme();

  const onChangeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const changeThemeActions = [
    { label: 'System Theme', onClick: () => onChangeTheme('system') },
    { label: 'Dark Theme', onClick: () => onChangeTheme('dark') },
    { label: 'Light Theme', onClick: () => onChangeTheme('light') },
  ];

  const onCLickAppearance = (event: React.MouseEvent<HTMLButtonElement>) => {
    settingsModalDispatch({ type: 'CLOSE_SUB_SETTINGS_MODAL' });
    settingsModalDispatch({ type: 'OPEN_SETTINGS_MODAL' });
    event.stopPropagation();
  };

  return (
    <div>
      {/*  Row-1 Return to Setting Modal */}
      <section className="p-2 border-b-[0.5px] ">
        <button onClick={onCLickAppearance} className=" flex justify-start items-center h-10 px-2 space-x-2  w-60">
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="text-md p-2 rounded-full  transition-colors duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer "
          />
          <span className="text-[14px]">Appearance</span>
        </button>
      </section>
      {/*  Row-2 Return to Setting Modal */}
      <section className="grid  py-2 space-y-2 grid-cols">
        <span className="h-8  flex justify-start items-center px-3 text-[12px]">Settings applies to this browser only</span>
        {changeThemeActions.map((action, index) => (
          <div
            key={`${action}-${index}`}
            onClick={action.onClick}
            className="h-10 min-w-full flex justify-center items-center transition-colors duration-75 text-sm ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
          >
            <div className="relative w-full h-full flex justify-start items-center px-10">
              {(action.label.split(' ').shift()?.toLowerCase() as Theme) === theme && (
                <FontAwesomeIcon icon={faCheck} className=" absolute left-4  text-lg" />
              )}
              {action.label}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
