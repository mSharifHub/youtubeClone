import React from 'react';
import { JSX } from 'react/jsx-runtime';
import { useUser } from '../../contexts/userContext/UserContext.tsx';
import { useUserLogin } from '../hooks/useUserLogin.ts';
import { useUserLogout } from '../hooks/useUserLogout.ts';
import { useSettingsModal } from '../../contexts/SetttingsModalsContext/SettingsModalsContext.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import signOut from '../../assets/menu_bar_icons/sign-out.png';

import { faArrowLeft, faCheck, faUserPlus } from '@fortawesome/free-solid-svg-icons';

import { ProfileSkeleton } from './ProfileSkeleton.tsx';

export const SwitchAccount: React.FC = (): JSX.Element => {
  const {
    state: { user, isLoggedIn },
  } = useUser();



  const logout = useUserLogout();

  const { redirectGoogleAuth } = useUserLogin();

  const { dispatch: settingsModalDispatch } = useSettingsModal();

  const onCLickAccounts = (event: React.MouseEvent<HTMLButtonElement>) => {
    settingsModalDispatch({ type: 'CLOSE_SUB_SETTINGS_MODAL' });
    settingsModalDispatch({ type: 'OPEN_SETTINGS_MODAL' });
    event.stopPropagation();
  };




  return (
    <div className="p-2">
      {/* Row-1 return to main menu section */}
      <section className="p-2 border-b-[0.5px] ">
        <button onClick={onCLickAccounts} className=" flex justify-start items-center h-10 px-2 space-x-2  w-60">
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="text-md p-2 rounded-full  transition-colors duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer "
          />
          <span className="text-[14px]">Accounts</span>
        </button>
      </section>

      {/* Row-2 Username and email */}
      <section className="p-2 border-b-[0.5px]">
        {isLoggedIn && user && (
          <div className="px-2 text-sm">
            <div>
              {user.firstName} {user.lastName}
            </div>
            <div className="text-neutral-400 text-[12px]">{user.email}</div>
          </div>
        )}
      </section>

      {/* Row-3 User Profile */}
      <section>
        {isLoggedIn && user && (
          <ProfileSkeleton
            userProfile={user.profilePicture ?? undefined}
            firstName={user.firstName}
            lastName={user.lastName}
            youtubeHandler={`@${user.youtubeHandler}`}
            subscribersCount={Number(user.subscribers)}
          >
            <FontAwesomeIcon icon={faCheck} />
          </ProfileSkeleton>
        )}
      </section>

      {/*Row-4 Add Account And Sign out*/}
      <section className="flex  flex-col justify-start items-center p-2">
        <div
          onClick={() => redirectGoogleAuth()}
          className="h-10 w-full flex justify-start items-center  px-2 text-sm rounded-lg space-x-4 transition-colors duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer "
        >
          <FontAwesomeIcon icon={faUserPlus} className="text-sm" />
          <span>Switch account</span>
        </div>

        <div
          onClick={() => logout()}
          title="Log out"
          className="flex w-full h-10  px-2 items-center space-x-4  rounded-lg transition-colors transform duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <img src={signOut} alt="signOut" className=" min-h-4 min-w-4 w-4 h-4 dark:invert" />
          <h3 className="text-sm">Sign out</h3>
        </div>
      </section>
    </div>
  );
};
