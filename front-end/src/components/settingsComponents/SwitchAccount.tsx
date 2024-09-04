import React from 'react';
import { JSX } from 'react/jsx-runtime';
import { useUser } from '../../userContext/UserContext.tsx';
import { useUserLogin } from '../hooks/useUserLogin.ts';
import { useUserLogout } from '../hooks/useUserLogout.ts';
import { useSettingsModal } from './SetttingsModalsContext/SettingsModalsContext.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import signOut from '../../assets/menu_bar_icons/sign-out.png';
import {
  faArrowLeft,
  faCheck,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';

type GoogleAccounts = {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string | null | undefined;
  youtubeHandler: string;
  subscribersCount: number;
};

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

  /**
   *  TODO
   *  need to change to be an api call to the back end. Use state for now for testing
   */
  const googleAccounts: GoogleAccounts[] = user
    ? [
        {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture,
          youtubeHandler: user.youtubeHandler,
          subscribersCount: user.subscribers.length,
        },
      ]
    : [];

  return (
    <div>
      {/*  Row-1 Return to Setting Modal */}
      <section className="p-2 border-b-[0.5px] ">
        <button
          onClick={onCLickAccounts}
          className=" flex justify-start items-center h-10 px-2 space-x-2  w-60"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="text-md p-2 rounded-full  transition-colors duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer "
          />
          <span className="text-[14px]">Accounts</span>
        </button>
      </section>
      {/*  Row-2 First name, last name, and email */}
      <section className="p-2 border-b-[0.5px]">
        <div className=" flex flex-col justify-center items-start h-14 px-2 w-60 text-xs">
          <div>
            <span> {isLoggedIn && user && user.firstName}</span>
            <span> {isLoggedIn && user && user.lastName}</span>
          </div>
          <span className="text-neutral-400">
            {isLoggedIn && user && user.email}
          </span>
        </div>
      </section>
      {/* Row-3  Accounts List */}
      <section className=" flex justify-start items-center p-2">
        {googleAccounts.length > 0 &&
          googleAccounts.map(
            ({
              firstName,
              lastName,
              profilePicture,
              youtubeHandler,
              subscribersCount,
            }) => (
              <ul className="min-w-full" key={youtubeHandler}>
                <li className="grid grid-cols-[0.25fr_1fr] h-20 min-w-full space-x-1.5  p-2 rounded-lg transition-colors duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer">
                  <div className="col-start-1 col-span-1  flex justify-center items-center">
                    <img
                      src={(profilePicture as string) || undefined}
                      alt={`${youtubeHandler}-profilePicture`}
                      className="rounded-full min-h-14 min-w-14 w-14 h-14 "
                    />
                  </div>
                  <div className="col-start-2 col-span-1 flex flex-col">
                    <div className="space-x-2 text-sm">
                      <span>{firstName}</span>
                      <span>{lastName}</span>
                    </div>
                    <div className="flex flex-col w-full text-[12px] text-neutral-400">
                      <span className="relative">
                        @{youtubeHandler}
                        {isLoggedIn &&
                          user &&
                          user.youtubeHandler === youtubeHandler && (
                            <span className="absolute right-0">
                              <FontAwesomeIcon icon={faCheck} size="xl" />{' '}
                            </span>
                          )}
                      </span>
                      <div>
                        {subscribersCount === 0 && <span>no subscribers</span>}
                        {subscribersCount === 1 && (
                          <span>
                            {subscribersCount}
                            <span>subscriber</span>
                          </span>
                        )}
                        {subscribersCount > 1 && (
                          <span>
                            {subscribersCount} <span>subscribers</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            ),
          )}
      </section>
      {/* Row-4 view All Channels*/}
      <section className="flex justify-start items-center p-2 border-b-[0.5px] ">
        <div className="h-10 w-full flex justify-start items-center  px-2 text-sm rounded-lg transition-colors duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer ">
          View all channels
        </div>
      </section>
      {/*Row-5 Add Account And Sign out*/}
      <section className="flex  flex-col justify-start items-center p-2">
        <div
          onClick={() => redirectGoogleAuth()}
          className="h-10 w-full flex justify-start items-center  px-2 text-sm rounded-lg space-x-4 transition-colors duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer "
        >
          <FontAwesomeIcon icon={faUserPlus} className="text-sm" />{' '}
          <span>Add account</span>
        </div>

        <div
          onClick={() => logout()}
          title="Log out"
          className="flex w-full h-10  px-2 items-center space-x-4  rounded-lg transition-colors transform duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <img
            src={signOut}
            alt="signOut"
            className=" min-h-4 min-w-4 w-4 h-4 dark:invert"
          />
          <h3 className="text-sm">Sign out</h3>
        </div>
      </section>
    </div>
  );
};
