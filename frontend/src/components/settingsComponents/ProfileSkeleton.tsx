import React from 'react';

interface ProfileSkeletonProps {
  userProfile?: string | undefined;
  userName?: string;
  firstName?: string;
  lastName?: string;
  youtubeHandler?: string;
  children?: React.ReactNode;
  skeleton?: boolean;
  subscribersCount?: number;
}

export const ProfileSkeleton: React.FC<ProfileSkeletonProps> = ({ userProfile, userName, firstName, lastName, youtubeHandler, skeleton, subscribersCount, children }) => {
  return (
    <div
      className={`relative grid grid-cols-[0.25fr_1fr] h-20 min-w-full space-x-2 p-2  transition-colors duration-75 ease-out ${!skeleton && `hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer`} `}
    >
      {/* col-1 */}
      <div className={`col-start-1  col-span-1 flex  justify-center items-center ${skeleton && 'animate-pulse'} `}>
        {!skeleton ? (
          <img
            src={userProfile}
            className="rounded-full min-h-14 min-w-14 w-14 h-14 bg-neutral-100  dark:bg-neutral-700 "
            alt={userProfile && `${userName || lastName}-profilePicture`}
          />
        ) : (
          <div
            className="rounded-full min-h-14 min-w-14 w-14 h-14 bg-neutral-100
            dark:bg-neutral-700 "
          ></div>
        )}
      </div>

      {/* col-2 */}
      <div className={`col-start-2 py-2 flex flex-col space-y-2  ${skeleton && 'animate-pulse'}`}>
        <div className={`h-4 flex justify-start items-center space-x-2  text-md ${skeleton && 'bg-neutral-100 dark:bg-neutral-700'} `}>
          <span> {firstName}</span>
          <span> {lastName}</span>
        </div>
        <div className={`h-4 flex justify-start items-center text-neutral-400 text-[12px] ${skeleton && 'bg-neutral-100 dark:bg-neutral-700'} `}>{youtubeHandler}</div>

        <div className={`h-4 flex justify-start items-center text-neutral-400 text-[12px] ${skeleton && 'bg-neutral-100 dark:bg-neutral-700'} `}>
          {subscribersCount === 0 ? (
            <div>no subscribers</div>
          ) : subscribersCount === 1 ? (
            <div>
              <span>{subscribersCount}</span> subscriber
            </div>
          ) : subscribersCount > 1 ? (
            <div>
              <span>{subscribersCount}</span> subscribers
            </div>
          ) : null}

        </div>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">{children}</div>
    </div>
  );
};
