import userIconPath from '../assets/navigation_icons/user-icon.png';
import React from 'react';

export const LoginComponent: React.FC<{ redirectGoogleAuth: () => void }> = ({
  redirectGoogleAuth,
}) => {
  return (
    <div
      onClick={() => redirectGoogleAuth()}
      className="flex justify-center items-center border dark:border-neutral-700 rounded-full w-24  h-9 space-x-2  transition-colors transform duration-75 ease-out hover:bg-blue-100 dark:hover:bg-neutral-700  cursor-pointer"
      title="Sign in with Google"
    >
      <div className="flex justify-center items-center border border-blue-400 rounded-full ">
        <img src={userIconPath} alt="user-icon" className=" h-5 w-5  " />
      </div>

      <span className="text-sm  font-semibold text-blue-400 ">Sign in</span>
    </div>
  );
};
