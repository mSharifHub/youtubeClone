import React from 'react';
import { useUser } from '../../userContext/UserContext.tsx';
import { NotLoggedInBanner } from '../NotLoggedInBanner.tsx';
import useYoutubeVideos from '../hooks/useYoutubeVideos.ts';
import { useVideoGrid } from '../hooks/useVideosGrid.ts';
import { VideoCard } from '../VideoCard.tsx';
import { VideoCardLoading } from '../VideoCardLoading';
import dummyData from '../../../dummyData.json';

export const Home: React.FC = () => {
  const {
    state: { isLoggedIn },
  } = useUser();

  const api_key: string = import.meta.env.VITE_YOUTUBE_API_3;

  // Using the useVideo hook to control number of videos show per screen size

  const firstVideoRowsDisplayValues = {
    display_less_480: 1,
    display_481_699: 1,
    display_700_899: 2,
    display_900_1124: 2,
    display_1125_1420: 3,
    display_1421_1739: 4,
    display_1740_1920: 5,
    display_full: 5,
  };

  const videosPerRow = useVideoGrid(firstVideoRowsDisplayValues);
  const totalVideosToShowFirstRow = videosPerRow ? videosPerRow * 2 : 0;

  const firstShortsRowsDisplayValues = {
    display_less_480: 1,
    display_481_699: 1,
    display_700_899: 2,
    display_900_1124: 2,
    display_1125_1420: 3,
    display_1421_1739: 5,
    display_1740_1920: 6,
    display_full: 7,
  };
  const videosPerRowShorts = useVideoGrid(firstShortsRowsDisplayValues);
  const totalShortsToShowFirstRow = videosPerRowShorts;

  const { videos: firstVideoRows, loading: firstLoadingRow } = useYoutubeVideos(
    api_key,
    10,
    'firstSection',
  );

  const { videos: shortsVideoRows, loading: shortsLoading } = useYoutubeVideos(
    api_key,
    7,
    'shortsVideoRows',
  );

  // const { videos } = dummyData;
  //
  // const firstLoadingRow = false;

  return (
    <div className="h-full w-full flex flex-col justify-start items-start scroll-smooth overflow-y-auto">
      {!isLoggedIn && <NotLoggedInBanner />}

      {isLoggedIn && (
        <>
          {/* first row of videos */}
          <div
            className={`min-h-fit w-full grid grid-flow-row auto-rows-auto gap-8 md:gap-2  md:p-2`}
            style={{
              gridTemplateColumns: `repeat(${videosPerRow},minmax(0,1fr))`,
            }}
          >
            {firstVideoRows
              .slice(0, totalVideosToShowFirstRow)
              .map((video) =>
                !firstLoadingRow ? (
                  <VideoCard
                    key={`${video.id.videoId}-${video.snippet.title}`}
                    video={video}
                    style="relative h-[400px] sm:h-[300px]  md:h-[300px]  rounded-lg"
                  />
                ) : (
                  <VideoCardLoading
                    style=" relavtive  h-[400px] sm:h-[300px] md:h-[300px] w-full rounded-lg  bg-neutral-200 dark:dark-modal"
                    key={`${video.id.videoId}-${video.snippet.title}`}
                  />
                ),
              )}
          </div>

          {/*YouTube Shorts row */}
          <div className="mt-8 h-[800px]  w-full overflow-hidden">
            {/*YouTube Shorts logo */}
            <div className="flex flex-row  justify-start items-center">
              <img
                src="https://img.icons8.com/?size=100&id=ot8QhAKun4rZ&format=png&color=000000"
                className="min-h-10 min-w-10 h-10 w-10"
                alt="YoutubeShorts"
              />
              <h1 className="font-bold  text-lg dark:dark-modal">Shorts</h1>
            </div>

            {/*YouTube Shorts scroll row */}
            <div
              className={`min-h-fit w-full grid grid-flow-col  gap-x-5 justify-start items-center `}
              style={{
                gridTemplateColumns: `repeat(${videosPerRowShorts},minmax(0,1fr))`,
              }}
            >
              {shortsVideoRows
                .slice(0, totalShortsToShowFirstRow)
                .map((video) =>
                  !shortsLoading ? (
                    <div
                      className="h-full flex justify-center items-center"
                      key={`${video.id.videoId}-${video.snippet.title}`}
                    >
                      <VideoCard
                        video={video}
                        style="relative flex justify-center items-center  h-[500px] rounded-lg"
                      />
                    </div>
                  ) : (
                    <VideoCardLoading
                      style=" relavtive  h-[500px] w-full rounded-lg  bg-neutral-200 dark:dark-modal"
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
