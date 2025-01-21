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

  return (
    <div className="h-full w-full flex flex-col justify-start items-start">
      {!isLoggedIn && <NotLoggedInBanner />}

      {isLoggedIn && (
        <>
          <div
            className={`min-h-fit w-full grid grid-flow-row auto-rows-auto gap-8 md:gap-2  md:p-2 overflow-y-auto scroll-smooth border `}
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
                    style="relative h-[400px] sm:h-[300px]  md:h-[300px] rounded-lg border-[0.5px]"
                  />
                ) : (
                  <VideoCardLoading
                    key={`${video.id.videoId}-${video.snippet.title}`}
                  />
                ),
              )}
          </div>
        </>
      )}
    </div>
  );
};
