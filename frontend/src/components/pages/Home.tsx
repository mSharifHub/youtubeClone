import React, { useCallback, useEffect, useRef } from 'react';
import { useUser } from '../../contexts/userContext/UserContext.tsx';
import { useVideoGrid } from '../hooks/useVideosGrid.ts';
import { videosPerRowDisplayValues } from '../helpers/homeVideoDisplayOptions.ts';
import { NotLoggedInBanner } from '../bannerComponents/NotLoggedInBanner.tsx';
import { VideoCard } from '../VideoComponents/VideoCard.tsx';
import { VideoCardLoading } from '../VideoComponents/VideoCardLoading.tsx';
import useYoutubeVideos from '../hooks/useYoutubeVideos.ts';
import { loadFromDB } from '../../utils/videoCacheDb/videoCacheDB.ts';

export const Home: React.FC = () => {

  const {
    state: { isLoggedIn },
  } = useUser();

  const videosPerRow = useVideoGrid(videosPerRowDisplayValues);

   const totalVideosToFetch = videosPerRow ? videosPerRow * 2 : 10;

  const apiKey: string = import.meta.env.VITE_YOUTUBE_API_3;

  const containerLazyLoadRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef(null);

  const { videos ,setVideos,videosLoading ,videosError ,fetchVideos,  videosNextPageToken, handleSelectedVideo } = useYoutubeVideos(apiKey, totalVideosToFetch);

  const handleVideosScroll = useCallback(async () => {
    if (videosLoading || videos.length >= 50 || videosError) return;

    try {
      if (videosNextPageToken) {
        await fetchVideos(videosNextPageToken);
      }
    } catch (error) {
      console.error('Error fetching more videos on scroll', error);
    }
  }, [videosLoading, videos.length, videosError, videosNextPageToken]);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && isLoggedIn) {
          handleVideosScroll();
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
  }, [handleVideosScroll, isLoggedIn]);

  const fetchVideosOnLoad = async ()=>{
    try{
      const cachedVideos = await loadFromDB('infiniteScroll');
      if (cachedVideos.length > 0){
        setVideos(cachedVideos)
      }
      else{
        await  fetchVideos();
      }
    }catch(err){
      throw new Error(err instanceof Error ? err.message : 'an error occurred fetching videos');
    }
  }

  useEffect(() => {
    if (!isLoggedIn) return;
    const load = async  ()=>{
     await fetchVideosOnLoad()
    }
    load()
  }, [isLoggedIn]);

  return (
    <div
      className="h-screen flex flex-col justify-between  items-start scroll-smooth  gap-y-[80px] overflow-y-auto p-8 "
      ref={containerLazyLoadRef}
    >
      {!isLoggedIn && <NotLoggedInBanner />}

      {isLoggedIn && (
        <>
          <div
            className={`min-h-fit grow w-full grid grid-flow-row gap-8  p-2 `}
            style={{
              gridTemplateColumns: `repeat(${videosPerRow},minmax(0,1fr))`,
            }}
          >
            {videos
              .slice(
                0,
                Math.floor(videos.length / (videosPerRow ? videosPerRow : 1)) * (videosPerRow ? videosPerRow : 1),
              )
              .map((video) => (
                <div key={`${video.id.videoId}-${video.snippet.title}`} onClick={() => handleSelectedVideo(video)}>
                  <VideoCard video={video} />
                </div>
              ))}
          </div>

          {videosLoading && (
            <>
              <div
                className="min-h-fit w-full grid grid-flow-row  mt-8 gap-10 "
                style={{
                  gridTemplateColumns: `repeat(${videosPerRow}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({
                  length: 10,
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
