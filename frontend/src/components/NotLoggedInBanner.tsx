import React from 'react';

export const NotLoggedInBanner: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[100px]  mx-auto min-w-96 px-4 bg-white rounded-lg drop-shadow-lg mt-8 dark:dark-modal">
      <span className="font-bold text-xl"> Try searching to get started</span>
      <span className="text-xs mx-4 mt-2">
        Start watching videos to help us build a feed fo videos you'll love.
      </span>
    </div>
  );
};
