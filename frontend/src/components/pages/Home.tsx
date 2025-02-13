import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useUser } from '../../userContext/UserContext.tsx';
import { useVideoGrid } from '../hooks/useVideosGrid.ts';
import {
  firstShortsRowsDisplayValues,
  firstVideoRowsDisplayValues,
} from '../helpers/homeVideoDisplayOptions.ts';
import { NotLoggedInBanner } from '../NotLoggedInBanner.tsx';
import { VideoCard } from '../VideoCard.tsx';
import { VideoCardLoading } from '../VideoCardLoading.tsx';
import useYoutubeVideos, { Video } from '../hooks/useYoutubeVideos.ts';
import { useThrottle } from '../hooks/useThrottle.ts';

export const Home: React.FC = () => {
  /**
   * A boolean variable that indicates whether a user is currently logged in.
   * It is set to true when the user has successfully authenticated, and false otherwise.
   * @see ../userContext
   */
  const {
    state: { isLoggedIn },
  } = useUser();

  /**
  @constant videosPerRow{number}
  @description A constant value that dynamically determines the number of videos per row using hook useVideoGrid
  @see hooks/useVideoGrid.ts - The custom hook implementation for detecting grid setting
   */
  const videosPerRow = useVideoGrid(firstVideoRowsDisplayValues);
  /**
   *
@constant shortsVideosPerRow{number}
@description A constant value that dynamically determines the number of videos per row using hook useVideoGrid
@see hooks/useVideoGrid.ts - The custom hook implementation for detecting grid setting
  */
  const shortsVideosPerRow = useVideoGrid(firstShortsRowsDisplayValues);

  /**
   * @constant it uses videosPerRow
   * @returns total videos for the first video section
   */
  const totalVideosFirstRow = videosPerRow ? videosPerRow * 2 : 0;

  /**
   * @constant  it uses shorts Videos
   * @returns total videos for the first video section
   */
  const totalShortsRow = shortsVideosPerRow ? shortsVideosPerRow : 0;

  /**
   * The `apiKey` variable holds the YouTube Data API v3 key,
   * which is required for authenticating requests to the YouTube API.
   *
   * The key is retrieved from the environment variable `VITE_YOUTUBE_API_3`.
   * It is typically used for server-side or client-side interactions with YouTube services.
   * Ensure this key is kept secure and not exposed publicly to prevent unauthorized access.
   */
  const apiKey: string = import.meta.env.VITE_YOUTUBE_API_3;

  /**
   * A mutable reference object used with the `useRef`  to  use the custom infinite scroll implementation to
   * load more videos
   */
  const containerLazyLoadRef = useRef<HTMLDivElement | null>(null);

  /**
   * Represents the first row of a dataset, grid, table, or any similar structure.
   * This row is typically used to hold data or metadata associated with the
   * first entry in a collection.
   */
  const { videos: firstRow, loading: firstRowLoading } = useYoutubeVideos(
    apiKey,
    totalVideosFirstRow,
    'first_row_videos',
  );

  /**
   * Represents a row of data or information related to shorts.
   */
  const { videos: shortsRow, loading: shortsLoading } = useYoutubeVideos(
    apiKey,
    totalShortsRow,
    'shorts_videos',
  );

  /**
   * A variable that represents a collection or stream of video data
   * designed to provide an infinite or continuously loading video experience.
   */
  const {
    videos: infScrollVideos,
    loading: isInfScrollLoading,
    error: infScrollError,
    loadMoreVideos,
  } = useYoutubeVideos(apiKey, totalVideosFirstRow, 'infinite_scroll', true);

  /**
   *@constant defines number of videos to fetch from api based on the number of videos per row
   */
  const [videosToRender, setvideosToRender] = useState<number>(0);

  /**
   * A callback function to handle infinite scrolling behavior. This function listens
   * to the scroll event on a referenced container and triggers the loading of more
   * videos when the user scrolls close to the bottom of the container.
   *
   * Dependencies:
   * - The function uses a ref to the scrollable container (`containerLazyLoadRef`).
   * - It is also dependent on `isInfScrollLoading` to check if videos are currently being loaded.
   * - `loadMoreVideos` is a function that loads additional videos when triggered.
   *
   * Key logic:
   * - If the `containerLazyLoadRef` is not yet assigned or if videos are currently being loaded, the function exits early.
   * - It calculates the current scroll position and checks if the user has scrolled within 200px of the bottom of the container.
   * - If the bottom scroll threshold is met, the function proceeds to trigger the `loadMoreVideos` function.
   *
   * Debugging:
   * - Logs a debugging message to the console when additional videos are being loaded.
   *
   * Memoization:
   * - The function is memoized using `useCallback` to optimize performance and prevent unnecessary re-renderings.
   */

  const handleInfiniteScroll = useCallback(() => {
    if (!containerLazyLoadRef.current || isInfScrollLoading) return;

    const { scrollTop, scrollHeight, clientHeight } =
      containerLazyLoadRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 200) {
      loadMoreVideos();
    }
  }, [loadMoreVideos, isInfScrollLoading]);

  /**
   *Updates the videos to render when the number of videos or rows changes
   *Behavior:
   * - When the screen width changes either more or less videos per row is to display.  Only fetch number of videos
   * that are to fill each row to prevent  unnecessary fetching  of incomplete rows
   */
  useEffect(() => {
    if (videosPerRow) {
      const fullRows =
        Math.floor(infScrollVideos.length / videosPerRow) * videosPerRow;
      setvideosToRender(fullRows);
    }
  }, [infScrollVideos.length, videosPerRow]);

  const infiniteScrollWithThrottle = useThrottle(handleInfiniteScroll, 100);

  useEffect(() => {
    const container = containerLazyLoadRef.current;
    if (!container) return;

    container.addEventListener('scroll', infiniteScrollWithThrottle);
    return () => {
      container.removeEventListener('scroll', infiniteScrollWithThrottle);
    };
  }, [infiniteScrollWithThrottle]);

  const bottom = true;

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
            className={`min-h-fit w-full grid grid-flow-row auto-rows-auto gap-8 p-2`}
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
          <div className="min-h-fit w-full flex flex-col mb-20">
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
            className={`min-h-fit w-full grid grid-flow-row gap-8  p-2`}
            style={{
              gridTemplateColumns: `repeat(${videosPerRow},minmax(0,1fr))`,
              gridAutoRows: '300px',
            }}
          >
            {infScrollVideos.slice(0, videosToRender).map((video) => (
              <VideoCard
                key={`${video.id.videoId}-${video.snippet.title}`}
                video={video}
              />
            ))}
          </div>

          {/*loading videos per row */}
          {isInfScrollLoading && !infScrollError ? (
            <>
              <div
                className="min-h-fit w-full grid grid-flow-row  mt-8 gap-10"
                style={{
                  gridTemplateColumns: `repeat(${videosPerRow}, minmax(0, 1fr))`,
                  gridAutoRows: '300px',
                }}
              >
                {Array.from({
                  length: totalVideosFirstRow,
                }).map((_, index) => (
                  <VideoCardLoading
                    key={`loading-${index}`}
                    style="h-[200px] rounded-lg bg-neutral-200 dark:dark-modal"
                  />
                ))}
              </div>

              <div className="flex w-full justify-center items-center">
                <div className="min-h-9 min-w-9  h-9 w-9 border-2 rounded-full animate-spin  duration-75 dark:border-slate-300 dark:border-t-black border-grey  border-t-white" />
              </div>
            </>
          ) : (
            <div className="flex w-full justify-center items-center text-white">
              <h1>{infScrollError}</h1>
            </div>
          )}
        </>
      )}
    </div>
  );
};
