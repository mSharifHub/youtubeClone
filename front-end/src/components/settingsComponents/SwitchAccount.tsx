import React from 'react';
import { JSX } from 'react/jsx-runtime';
import { useUser } from '../../userContext/UserContext.tsx';
import { useUserLogin } from '../hooks/useUserLogin.ts';
import { useUserLogout } from '../hooks/useUserLogout.ts';
import { useSettingsModal } from './SetttingsModalsContext/SettingsModalsContext.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGoogleAuthList } from "./useListAccounts.ts";

import signOut from '../../assets/menu_bar_icons/sign-out.png';

import {
  faArrowLeft,
  faCheck,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';



export const SwitchAccount: React.FC = (): JSX.Element => {
  const {
    state: { user, isLoggedIn },
  } = useUser();


  const {usersAuthList,loading,error} = useGoogleAuthList()



  const logout = useUserLogout();

  const { redirectGoogleAuth } = useUserLogin();

  const { dispatch: settingsModalDispatch } = useSettingsModal();

  const onCLickAccounts = (event: React.MouseEvent<HTMLButtonElement>) => {
    settingsModalDispatch({ type: 'CLOSE_SUB_SETTINGS_MODAL' });
    settingsModalDispatch({ type: 'OPEN_SETTINGS_MODAL' });
    event.stopPropagation();
  };

  console.log(...usersAuthList);

  return (
    <div>
      {/* return to main menu section */}
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
      <section>
            {isLoggedIn &&
                  <div
                    className=" relative grid grid-cols-[0.25fr_1fr] h-20 w-full  space-x-1.5 p-2 rounded-lg transition-colors duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer">
                    <div className="col-start-1 col-span-1 flex justify-center items-center">
                      <img
                        src={user?.profilePicture || undefined}
                        alt={`${user?.youtubeHandler}-profilePicture`}
                        className="rounded-full min-h-14 min-w-14 w-14 h-14"
                      />
                    </div>
                    <div className="col-start-2 flex flex-col text-xs">
                        <span>{user?.firstName} {user?.lastName} </span>
                        <span>{user?.youtubeHandler}</span>
                    </div>
                    <FontAwesomeIcon icon= {faCheck}  className="absolute right-4 top-1/2 -translate-y-1/2" />
                  </div>
            }
      </section>
      {/*Row-4 view All Channels*/}
      <section className="flex justify-start items-center border-b-[0.5px] ">
        <div className="h-10 w-full flex justify-start items-center  px-2 text-sm  transition-colors duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer ">
          View all channels
        </div>
      </section>

      {/*Row-3 Accounts authenticated List */}
      <section className="flex flex-col justify-start items-start p-2">
        <div className="text-xs font-bold"> other accounts</div>
        {loading &&
          <div>
            ....loading
          </div>}
        { !error && usersAuthList.length > 0 &&
          usersAuthList
            .filter((account) => account.email !== user?.email) // Filter accounts that do not match the logged-in user's email
            .map((account, index) => (
              <ul className="min-w-full" key={`${account.id}-${index}`}>
                <li
                  className="grid grid-cols-[0.25fr_1fr] h-20 min-w-full space-x-1.5 p-2 rounded-lg transition-colors duration-75 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                >
                  <div className="col-start-1 col-span-1 flex justify-center items-center">
                    <img
                      src={account.imageUrl || undefined}
                      alt={`${account.name}-profilePicture`}
                      className="rounded-full min-h-14 min-w-14 w-14 h-14"
                    />
                  </div>
                </li>
              </ul>
            ))}
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
