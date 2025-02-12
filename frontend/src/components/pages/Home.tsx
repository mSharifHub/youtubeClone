import React, { useCallback, useEffect, useRef } from 'react';
import { useUser } from '../../userContext/UserContext.tsx';
import { useVideoGrid } from '../hooks/useVideosGrid.ts';
import {
  firstShortsRowsDisplayValues,
  firstVideoRowsDisplayValues,
} from '../helpers/homeVideoDisplayOptions.ts';
import { NotLoggedInBanner } from '../NotLoggedInBanner.tsx';
import { VideoCard } from '../VideoCard.tsx';
import { VideoCardLoading } from '../VideoCardLoading.tsx';
import useYoutubeVideos from '../hooks/useYoutubeVideos.ts';
import { useThrottle } from '../hooks/useThrottle.ts';

export const Home: React.FC = () => {
  // useState to check if user is logged in
  const {
    state: { isLoggedIn },
  } = useUser();

  // changes the number of video columns as the screen width changes
  const videosPerRow = useVideoGrid(firstVideoRowsDisplayValues);

  // changes the columns for the shorts rows as the screen width changes
  const shortsVideosPerRow = useVideoGrid(firstShortsRowsDisplayValues);

  // This will make the first batch of videos rows
  const totalVideosFirstRow = videosPerRow ? videosPerRow * 2 : 0;

  const totalShortsRow = shortsVideosPerRow ? shortsVideosPerRow : 0;

  // This api key is to use along with use hook youtube videos
  const apiKey: string = import.meta.env.VITE_YOUTUBE_API_3;
  const containerLazyLoadRef = useRef<HTMLDivElement | null>(null);

  // First row of videos API call
  const { videos: firstRow, loading: firstRowLoading } = useYoutubeVideos(
    apiKey,
    totalVideosFirstRow,
    'first_row_videos',
  );

  // Short row of videos API call
  const { videos: shortsRow, loading: shortsLoading } = useYoutubeVideos(
    apiKey,
    totalShortsRow,
    'shorts_videos',
  );

  // infinite scroll API call
  const {
    videos: infiniteVideos,
    loading: isInfiniteVideosLoading,
    error: infiniteVideosError,
    loadMoreVideos,
  } = useYoutubeVideos(apiKey, totalVideosFirstRow, 'infinite_scroll', true);

  const bottom = true;

  // function to call the function that handles fetching more videos
  const handleInfiniteScroll = useCallback(() => {
    if (!containerLazyLoadRef.current || isInfiniteVideosLoading) return;

    const { scrollTop, scrollHeight, clientHeight } =
      containerLazyLoadRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 200) {
      console.log(`[Debugging] reached bottom and loading more videos`);
      // loadMoreVideos();
    }
  }, [isInfiniteVideosLoading, loadMoreVideos]);

  const infiniteScrollWithThrottle = useThrottle(handleInfiniteScroll, 100);

  useEffect(() => {
    const container = containerLazyLoadRef.current;
    if (!container) return;

    container.addEventListener('scroll', infiniteScrollWithThrottle);
    return () => {
      container.removeEventListener('scroll', infiniteScrollWithThrottle);
    };
  }, [infiniteScrollWithThrottle]);

  /***************End of API Call To Fetch Videos **********************************/

  return (
    <div
      className="h-full flex flex-col justify-start items-start scroll-smooth overflow-y-auto"
      ref={containerLazyLoadRef}
    >
      {!isLoggedIn && <NotLoggedInBanner />}

      {isLoggedIn && (
        <>
          {/* first row of videos */}
          <div
            className={`min-h-fit w-full grid grid-flow-row auto-rows-auto gap-8 p-2 border `}
            style={{
              gridTemplateColumns: `repeat(${videosPerRow},minmax(0,1fr))`,
            }}
          >
            {firstRow
              .slice(0, totalVideosFirstRow)
              .map((video) =>
                !firstRowLoading ? (
                  <VideoCard
                    key={`${video.id.videoId}-${video.snippet.title}`}
                    video={video}
                  />
                ) : (
                  <VideoCardLoading
                    style="flex justify-center items-center h-[200px] rounded-lg  bg-neutral-200 dark:dark-modal"
                    key={`${video.id.videoId}-${video.snippet.title}`}
                  />
                ),
              )}
          </div>

          {/*YouTube Shorts row */}
          <div className="min-h-fit w-full flex flex-col mb-20 border ">
            {/*YouTube Shorts logo */}
            <div className="flex flex-row  justify-start items-center mb-4 ">
              <img
                src="https://img.icons8.com/?size=100&id=ot8QhAKun4rZ&format=png&color=000000"
                className="min-h-10 min-w-10 h-10 w-10"
                alt="YoutubeShorts"
              />
              <h1 className="font-bold  text-lg dark:dark-modal">Shorts</h1>
            </div>

            <div
              className=" grid grid-flow-row gap-8 "
              style={{
                gridTemplateColumns: `repeat(${shortsVideosPerRow},minmax(0,1fr))`,
              }}
            >
              {shortsRow.slice(0, shortsVideosPerRow).map((video) =>
                !shortsLoading ? (
                  <VideoCard
                    key={`${video.id.videoId}-${video.snippet.title}`}
                    video={video}
                    shorts={true}
                  />
                ) : (
                  <div className=" h-full justify-center items-center ">
                    <VideoCardLoading
                      style="flex justify-center items-center h-[500px] rounded-lg  bg-neutral-200 dark:dark-modal "
                      key={`${video.id.videoId}-${video.snippet.title}`}
                    />
                  </div>
                ),
              )}
            </div>
          </div>

          {/* infinite video scroll */}
          <div
            className={`min-h-fit w-full grid grid-flow-row gap-8  p-2 border`}
            style={{
              gridTemplateColumns: `repeat(${videosPerRow},minmax(0,1fr))`,
              gridAutoRows: '300px',
            }}
          >
            {infiniteVideos.map((video) => (
              <VideoCard
                key={`${video.id.videoId}-${video.snippet.title}`}
                video={video}
              />
            ))}
          </div>

          {bottom && (
            <div
              className="min-h-fit w-full grid grid-flow-row   p-2 border"
              style={{
                gridTemplateColumns: `repeat(${videosPerRow},minmax(0,1fr))`,
                gridAutoRows: '300px',
              }}
            >
              {Array.from({ length: videosPerRow! }).map((_, index) => (
                <VideoCardLoading
                  key={`loading-${index}`}
                  style=" h-[200px] rounded-lg  bg-neutral-200 dark:dark-modal"
                />
              ))}
            </div>
          )}

          {/* loading  */}
          {isInfiniteVideosLoading && (
            <div className="flex w-full justify-center items-center">
              <div className="min-h-9 min-w-9  h-9 w-9 border-2 rounded-full animate-spin  duration-75 dark:border-slate-300 dark:border-t-black border-grey  border-t-white" />
            </div>
          )}

          {/*error display */}
          {infiniteVideosError && (
            <div className="flex w-full justify-center items-center">
              <h1>{infiniteVideosError}</h1>
            </div>
          )}
        </>
      )}
    </div>
  );
};
