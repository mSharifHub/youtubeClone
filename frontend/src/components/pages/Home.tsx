import React, { useCallback, useEffect, useRef } from 'react';
import { useUser } from '../../contexts/userContext/UserContext.tsx';
import { useVideoGrid } from '../hooks/useVideosGrid.ts';
import { firstShortsRowsDisplayValues, firstVideoRowsDisplayValues } from '../helpers/homeVideoDisplayOptions.ts';
import { NotLoggedInBanner } from '../bannerComponents/NotLoggedInBanner.tsx';
import { VideoCard } from '../VideoComponents/VideoCard.tsx';
import { VideoCardLoading } from '../VideoComponents/VideoCardLoading.tsx';
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

  const apiKey: string = import.meta.env.VITE_YOUTUBE_API_3;

  /**
   * A mutable reference object used with the `useRef`  to  use the custom infinite scroll implementation to load more videos
   */
  const containerLazyLoadRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef(null);

  const {
    videos: firstRow,
    loading: firstRowLoading,
    fetchVideos: fetchFirstRow,
  } = useYoutubeVideos(apiKey, totalVideosFirstRow);

  /**
   * Represents a row of data or information related to shorts.
   */
  const { videos: shortsRow, loading: shortsLoading, fetchVideos: fetchShortsRow } = useYoutubeVideos(apiKey, totalShortsRow);

  const totalVideosToFetch = videosPerRow ? videosPerRow * 2 : 10;

  const {
    videos: infScrollVideos,
    loading: isInfScrollLoading,
    error: isInfScrollError,
    fetchVideos: infFetchVideos,
    nextPageToken,
    handleSelectedVideo,
  } = useYoutubeVideos(apiKey, totalVideosToFetch);

  const handleInfiniteScroll = useCallback(() => {
    if (isInfScrollLoading || infScrollVideos.length >= 20 || isInfScrollError) {
      return;
    } else {
      if (nextPageToken) {
        infFetchVideos(nextPageToken);
      }
    }
  }, [isInfScrollLoading, infScrollVideos.length, isInfScrollError, nextPageToken]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && isLoggedIn) {
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

  useEffect(() => {
    if (isLoggedIn) {
      fetchFirstRow();
      fetchShortsRow();
      infFetchVideos();
    }
  }, []);

  /***************End of API Call To Fetch Videos **********************************/
  return (
    <div
      className="h-screen flex flex-col justify-between  items-start scroll-smooth  gap-y-[80px] overflow-y-auto p-8 "
      ref={containerLazyLoadRef}
    >
      {!isLoggedIn && <NotLoggedInBanner />}

      {isLoggedIn && (
        <>
          {/* first row of videos */}
          <div
            className={`min-h-fit grow w-full grid grid-flow-row auto-rows-auto gap-12  `}
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
                    style="flex justify-center items-center aspect-video rounded-lg  bg-neutral-200 dark:dark-modal"
                    key={`${video.id.videoId}-${video.snippet.title}`}
                  />
                ),
              )}
          </div>

          {/*YouTube Shorts row */}
          <div className="min-h-fit w-full flex flex-col justify-start items-start ">
            {/*YouTube Shorts logo */}
            <div className="flex flex-row  justify-start items-center  mb-4 ">
              <img
                src="https://img.icons8.com/?size=100&id=ot8QhAKun4rZ&format=png&color=000000"
                className="min-h-10 min-w-10 h-10 w-10"
                alt="YoutubeShorts"
              />
              <h1 className="font-bold text-lg">Shorts</h1>
            </div>

            <div className=" h-[600px] w-full grid  grid-flow-col  gap-12 ">
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
            className={`min-h-fit grow w-full grid grid-flow-row gap-8  p-2 `}
            style={{
              gridTemplateColumns: `repeat(${videosPerRow},minmax(0,1fr))`,
            }}
          >
            {infScrollVideos
              .slice(
                0,
                Math.floor(infScrollVideos.length / (videosPerRow ? videosPerRow : 1)) * (videosPerRow ? videosPerRow : 1),
              )
              .map((video) => (
                <div key={`${video.id.videoId}-${video.snippet.title}`} onClick={() => handleSelectedVideo(video)}>
                  <VideoCard video={video} />
                </div>
              ))}
          </div>

          {isInfScrollLoading && (
            <>
              <div
                className="min-h-fit w-full grid grid-flow-row  mt-8 gap-10 "
                style={{
                  gridTemplateColumns: `repeat(${videosPerRow}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({
                  length: totalVideosFirstRow,
                }).map((_, index) => (
                  <VideoCardLoading key={`loading-${index}`} style=" aspect-video rounded-lg bg-neutral-200 dark:dark-modal" />
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
