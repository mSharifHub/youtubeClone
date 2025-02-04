import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useUser } from '../../userContext/UserContext.tsx';
import { useVideoGrid } from '../hooks/useVideosGrid.ts';
import {
  firstShortsRowsDisplayValues,
  firstVideoRowsDisplayValues,
} from '../helpers/homeVideoDisplayOptions.ts';
import { NotLoggedInBanner } from '../NotLoggedInBanner.tsx';
import dummyData from '../../../dummyData.json';
import { VideoCard } from '../VideoCard.tsx';
import { VideoCardLoading } from '../VideoCardLoading.tsx';

export const Home: React.FC = () => {
  // useState to check if user is logged in
  const {
    state: { isLoggedIn },
  } = useUser();
  // This api key is to use along with use hook youtube videos
  const apiKey: string = import.meta.env.VITE_YOUTUBE_API_3;

  // changes the number of video columns as the screen width changes
  const videosPerRow = useVideoGrid(firstVideoRowsDisplayValues);

  // changes the columns for the shorts rows as the screen width changes
  const shortsVideosPerRow = useVideoGrid(firstShortsRowsDisplayValues);

  // This will make the first batch of videos rows
  const totalVideosFirstRow = videosPerRow ? videosPerRow * 2 : 0;

  const VIDEOS_PER_LOAD = totalVideosFirstRow;

  /*********************************************************************
  For debugging use the dummy data to not exceed Youtube's api limit*/
  const { videos } = dummyData;
  const firstRowVideos = videos.slice(0, totalVideosFirstRow);
  const shortsVideosRow = videos.slice(0, shortsVideosPerRow);
  const [displayVideos, setDisplayVideos] = useState<typeof videos>([]);
  const [count, setCount] = useState(0);
  const [hasMore, setHasMore] = useState<boolean>(
    videos.length > VIDEOS_PER_LOAD,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false);
  const containerLazyLoadRef = useRef<HTMLDivElement | null>(null);

  const loadMoreItems = useCallback(() => {
    if (!hasMore || loading) return;

    setLoading(true);
    setCount((prevCount) => prevCount + 1);

    setTimeout(() => {
      setDisplayVideos((prevVideos) => {
        const nextVideos = videos.slice(
          prevVideos.length,
          prevVideos.length + VIDEOS_PER_LOAD,
        );
        if (nextVideos.length == 0) setHasMore(false);
        return [...prevVideos, ...nextVideos];
      });
      setLoading(false);
    }, 500);
  }, [loading, hasMore]);

  const handleScroll = useCallback(() => {
    if (!containerLazyLoadRef.current || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } =
      containerLazyLoadRef.current;

    if (scrollTop + clientHeight >= scrollHeight) {
      loadMoreItems();
    }
  }, [loading, loadMoreItems, hasMore]);

  const loadingStaticVideos = false;

  useEffect(() => {
    console.log(`[Debugging] load more count: ${count}`);
    const scrollContainer = containerLazyLoadRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);
  /* end of debugging*******************************************************************/

  return (
    <div
      className="h-full flex flex-col justify-start items-start scroll-smooth overflow-y-auto pb-10 "
      ref={containerLazyLoadRef}
    >
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
            {firstRowVideos.map((video) =>
              !loadingStaticVideos ? (
                <div className="justify-center items-center overflow-hidden">
                  <VideoCard
                    key={`${video.id.videoId}-${video.snippet.title}`}
                    video={video}
                    style="relative flex w-[100%]  justify-center items-center h-[200px]  rounded-lg  "
                  />
                </div>
              ) : (
                <VideoCardLoading
                  style=" relative  h-[200px] w-full rounded-lg  bg-neutral-200 dark:dark-modal"
                  key={`${video.id.videoId}-${video.snippet.title}`}
                />
              ),
            )}
          </div>

          {/*YouTube Shorts row */}
          <div className="h-[800px] w-full">
            {/*YouTube Shorts logo */}
            <div className="flex flex-row  justify-start items-center mb-4">
              <img
                src="https://img.icons8.com/?size=100&id=ot8QhAKun4rZ&format=png&color=000000"
                className="min-h-10 min-w-10 h-10 w-10"
                alt="YoutubeShorts"
              />
              <h1 className="font-bold  text-lg dark:dark-modal">Shorts</h1>
            </div>

            <div
              className="grid grid-flow-col gap-x-5 "
              style={{
                gridTemplateColumns: `repeat(${shortsVideosPerRow},minmax(0,1fr))`,
              }}
            >
              {shortsVideosRow.map((video) =>
                !loadingStaticVideos ? (
                  <div
                    className="h-full"
                    key={`${video.id.videoId}-${video.snippet.title}`}
                  >
                    <VideoCard
                      video={video}
                      style="relative h-[500px]  rounded-lg"
                    />
                  </div>
                ) : (
                  <div className=" h-full w-full justify-center items-center ">
                    <VideoCardLoading
                      style="relative  flex justify-center items-center h-[500px] rounded-lg  bg-neutral-200 dark:dark-modal "
                      key={`${video.id.videoId}-${video.snippet.title}`}
                    />
                  </div>
                ),
              )}
            </div>
          </div>

          {/* infinite video scroll */}
          <div
            className={`min-h-fit w-full grid grid-flow-row gap-4  mt-2 p-1`}
            style={{
              gridTemplateColumns: `repeat(${videosPerRow},minmax(0,1fr))`,
              gridAutoRows: '300px',
            }}
          >
            {displayVideos.map((video) =>
              !loadingStaticVideos ? (
                <div className="justify-center items-center overflow-hidden">
                  <VideoCard
                    key={`${video.id.videoId}-${video.snippet.title}`}
                    video={video}
                    style="relative flex w-full h-[200px]  justify-center items-center   rounded-lg"
                  />
                </div>
              ) : (
                <VideoCardLoading
                  style=" relative  h-[200px] w-full rounded-lg  bg-neutral-200 dark:dark-modal"
                  key={`${video.id.videoId}-${video.snippet.title}`}
                />
              ),
            )}
          </div>

          {/* loading  */}
          {hasMore && loading && (
            <div className="flex w-full justify-center items-center">
              <div className="min-h-9 min-w-9  h-9 w-9 border-2 rounded-full animate-spin  duration-75 dark:border-slate-300 dark:border-t-black border-grey  border-t-white" />
            </div>
          )}
        </>
      )}
    </div>
  );
};
