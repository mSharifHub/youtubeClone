import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useUser } from '../../userContext/UserContext.tsx';
import { useVideoGrid } from '../hooks/useVideosGrid.ts';
import { firstShortsRowsDisplayValues, firstVideoRowsDisplayValues } from '../helpers/homeVideoDisplayOptions.ts';
import { NotLoggedInBanner } from '../NotLoggedInBanner.tsx';
import { VideoCard } from '../VideoCard.tsx';
import { VideoCardLoading } from '../VideoCardLoading.tsx';
import useYoutubeVideos from '../hooks/useYoutubeVideos.ts';

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
   *@constant defines number of videos to fetch from api based on the number of videos per row
   */
  const [videosToRender, setVideosToRender] = useState<number>(totalVideosFirstRow);

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
  const sentinelRef = useRef(null);

  /**
   * Represents the first row of a dataset, grid, table, or any similar structure.
   * This row is typically used to hold data or metadata associated with the
   * first entry in a collection.
   */
  const { videos: firstRow, loading: firstRowLoading } = useYoutubeVideos(apiKey, totalVideosFirstRow, 'first_row_videos');

  /**
   * Represents a row of data or information related to shorts.
   */
  const { videos: shortsRow, loading: shortsLoading } = useYoutubeVideos(apiKey, totalShortsRow, 'shorts_videos');

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

  const handleInfiniteScroll = useCallback(() => {
    if (isInfScrollLoading || infScrollError) return;
    loadMoreVideos();
  }, [isInfScrollLoading, infScrollError, loadMoreVideos]);

  /**
   *Updates the videos to render when the number of videos or rows changes
   *Behavior:
   * - When the screen width changes either more or less videos per row is to display.  Only fetch number of videos
   * that are to fill each row to prevent  unnecessary fetching  of incomplete rows
   */
  useEffect(() => {
    if (videosPerRow) {
      const fullRows = Math.floor(infScrollVideos.length / videosPerRow) * videosPerRow;
      setVideosToRender(fullRows);
    }
  }, [infScrollVideos.length, videosPerRow]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && isLoggedIn) {
          console.log('Observer Triggered...');
          handleInfiniteScroll();
        }
      },
      {
        root: containerLazyLoadRef.current,
        rootMargin: '100px',
        threshold: 0,
      },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [handleInfiniteScroll, isLoggedIn]);

  /***************End of API Call To Fetch Videos **********************************/
  return (
    <div className="h-screen flex flex-col justify-between items-start scroll-smooth overflow-y-auto" ref={containerLazyLoadRef}>
      {!isLoggedIn && <NotLoggedInBanner />}

      {isLoggedIn && (
        <>
          {/* first row of videos */}
          <div
            className={`min-h-fit grow w-full grid grid-flow-row auto-rows-auto  mb-8 gap-8 p-2  `}
            style={{
              gridTemplateColumns: `repeat(${videosPerRow},minmax(0,1fr))`,
            }}
          >
            {firstRow
              .slice(0, totalVideosFirstRow)
              .map((video) =>
                !firstRowLoading ? (
                  <VideoCard key={`${video.id.videoId}-${video.snippet.title}`} video={video} />
                ) : (
                  <VideoCardLoading
                    style="flex justify-center items-center h-[200px] rounded-lg  bg-neutral-200 dark:dark-modal"
                    key={`${video.id.videoId}-${video.snippet.title}`}
                  />
                ),
              )}
          </div>

          {/*YouTube Shorts row */}
          <div className="min-h-fit grow w-full flex flex-col mb-8 ">
            {/*YouTube Shorts logo */}
            <div className="flex flex-row  justify-start items-center mb-4 ">
              <img
                src="https://img.icons8.com/?size=100&id=ot8QhAKun4rZ&format=png&color=000000"
                className="min-h-10 min-w-10 h-10 w-10"
                alt="YoutubeShorts"
              />
              <h1 className="font-bold text-lg">Shorts</h1>
            </div>

            <div
              className=" grid grid-flow-row gap-8 "
              style={{
                gridTemplateColumns: `repeat(${shortsVideosPerRow},minmax(0,1fr))`,
              }}
            >
              {shortsRow
                .slice(0, shortsVideosPerRow)
                .map((video) =>
                  !shortsLoading ? (
                    <VideoCard key={`${video.id.videoId}-${video.snippet.title}`} video={video} shorts={true} />
                  ) : (
                    <VideoCardLoading
                      style="flex justify-center items-center h-[500px] rounded-lg  bg-neutral-200 dark:dark-modal "
                      key={`${video.id.videoId}-${video.snippet.title}`}
                    />
                  ),
                )}
            </div>
          </div>

          {/* infinite video scroll */}
          <div
            className={`min-h-fit grow w-full grid grid-flow-row gap-8  p-2  `}
            style={{
              gridTemplateColumns: `repeat(${videosPerRow},minmax(0,1fr))`,
              gridAutoRows: '300px',
            }}
          >
            {infScrollVideos.slice(0, videosToRender).map((video) => (
              <VideoCard key={`${video.id.videoId}-${video.snippet.title}`} video={video} />
            ))}
          </div>

          {isInfScrollLoading && (
            <>
              <div
                className="min-h-fit w-full grid grid-flow-row  mt-8 gap-10 "
                style={{
                  gridTemplateColumns: `repeat(${videosPerRow}, minmax(0, 1fr))`,
                  gridAutoRows: '300px',
                }}
              >
                {Array.from({
                  length: totalVideosFirstRow,
                }).map((_, index) => (
                  <VideoCardLoading key={`loading-${index}`} style="h-[200px] rounded-lg bg-neutral-200 dark:dark-modal" />
                ))}
              </div>

              <div className="flex w-full justify-center items-center ">
                {/* eslint-disable-next-line max-len */}
                <div className="min-h-9 min-w-9  h-9 w-9 border-2 rounded-full animate-spin  duration-75 dark:border-slate-300 dark:border-t-black border-grey  border-t-white" />
              </div>
            </>
          )}
        </>
      )}

      {/* SentinelRef*/}
      <div ref={sentinelRef} className="h-2 w-full" />
    </div>
  );
};
