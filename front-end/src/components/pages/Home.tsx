import React from 'react';
import { useUser } from '../../userContext/UserContext.tsx';
import { NotLoggedInBanner } from '../NotLoggedInBanner.tsx';
import useYoutubeVideos from '../hooks/useYoutubeVideos.ts';
import { useVideoGrid } from '../hooks/useVideosGrid.ts';
import { VideoCard } from '../VideoCard.tsx';
import { VideoCardLoading } from '../VideoCardLoading';
import dummyData from '../../../dummyData.json';

import LocalCache from '../../apiCache/LocalCache.ts';

export const Home: React.FC = () => {
  const {
    state: { isLoggedIn },
  } = useUser();

  // const api_key: string = import.meta.env.VITE_YOUTUBE_API_3;

  // Using the useVideo hook to control number of videos show per screen size
  const videosPerRow = useVideoGrid();

  const totalVideosToShow = videosPerRow * 2;

  // const { videos: firstVideoRows, loading: firstLoadingRow } = useYoutubeVideos(
  //   api_key,
  //   10,
  //   'firstSection',
  // );

  const { videos } = dummyData;

  const firstLoadingRow = false;
  const shortsLoadingRow = false;

  return (
    <div className="h-full w-full flex flex-col justify-start items-start overflow-y-auto scroll-smooth  border">
      {!isLoggedIn && <NotLoggedInBanner />}

      {isLoggedIn && (
        <>
          <div
            className={` w-full grid grid-flow-row auto-rows-auto gap-8 md:gap-2  md:p-2 overflow-hidden `}
            style={{
              gridTemplateColumns: `repeat(${videosPerRow},minmax(0,1fr))`,
            }}
          >
            {videos
              .slice(0, totalVideosToShow)
              .map((video) =>
                !firstLoadingRow ? (
                  <VideoCard
                    key={`${video.id.videoId}-${video.snippet.title}`}
                    video={video}
                  />
                ) : (
                  <VideoCardLoading
                    key={`${video.id.videoId}-${video.snippet.title}`}
                  />
                ),
              )}
          </div>

          {/* shorts scrolling div */}
          <div className="mt-12 h-[600px] w-full flex flex-col  border">
            {/*shorts logo*/}
            <div className="flex flex-row justify-start items-center mx-4 space-x-2 border">
              <img
                src="https://img.icons8.com/?size=100&id=ot8QhAKun4rZ&format=png&color=000000"
                className="min-h-10 min-w-10 h-10 w-10"
                alt="shorts logo"
              />
              <span className="font-bold dark:dark-modal text-xl">Shorts</span>
            </div>

            <div className="mx-4 mt-2 h-full border justify-start grid grid-flow-col auto-cols-[400px] gap-12 overflow-x-auto scroll-smooth ">
              {videos.slice(0, totalVideosToShow).map((video) =>
                !shortsLoadingRow ? (
                  <div className="border rounded-lg">
                    <VideoCard
                      key={`${video.id.videoId}-${video.snippet.title}`}
                      video={video}
                    />
                  </div>
                ) : (
                  <VideoCardLoading
                    key={`${video.id.videoId}-${video.snippet.title}`}
                  />
                ),
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
