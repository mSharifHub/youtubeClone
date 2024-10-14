import React from 'react';

export const VideoCardLoading: React.FunctionComponent = () => {
  return (
    <div className="flex flex-col flex-wrap animate-opacity-pulse ">
      {/* skeleton for video thumbnails */}
      <div className="h-[400px] sm:h-[300px] md:h-[200px] w-full rounded-lg  bg-neutral-200 dark:dark-modal" />
      {/* skeleton for video and channel information */}
      <div className="flex flex-initial p-2 space-x-2">
        {/* skeleton for channel logo */}
        <div className="flex min-w-12 min-h-12 justify-center items-start">
          <div className="h-12 w-12 rounded-full bg-neutral-200 dark:dark-modal" />
        </div>
        {/* skeleton for video title and channel info */}
        <div className="flex flex-col justify-center items-start w-full ">
          {/* skeleton for video title */}
          <div className="w-full h-6  bg-neutral-200 dark:dark-modal rounded-sm mb-2" />
          {/* skeleton for channel title and views */}
          <div className="flex flex-col w-full space-y-1 ">
            {/* skeleton for channel title */}
            <div className="h-4  bg-neutral-200 dark:dark-modal rounded-sm w-1/2" />
            {/* skeleton for view count and published time */}
            <div className="flex flex-row gap-x-2 ">
              {/* skeleton for view count */}
              <div className="h-4 bg-neutral-200 dark:dark-modal rounded-sm w-1/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
