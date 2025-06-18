import React, { useLayoutEffect, useRef } from 'react';
import { useVideoGrid } from '../hooks/useVideosGrid.ts';
import { videosPerRowDisplayValues } from '../helpers/homeVideoDisplayOptions.ts';
import { NotLoggedInBanner } from '../bannerComponents/NotLoggedInBanner.tsx';
import { VideoCard } from '../VideoComponents/VideoCard.tsx';
import { VideoCardLoading } from '../VideoComponents/VideoCardLoading.tsx';
import useYoutubeVideos from '../hooks/useYoutubeVideos.ts';
import { useUser } from '../../contexts/userContext/UserContext.tsx';


export const Home: React.FC = () => {

  const videosPerRow = useVideoGrid(videosPerRowDisplayValues);
  const totalVideosToFetch = videosPerRow ? videosPerRow * 4 : 20;
  const apiKey: string = import.meta.env.VITE_YOUTUBE_API_3;
  const containerLazyLoadRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef< HTMLDivElement | null>(null);
  const { state: { isLoggedIn } } = useUser();
  const [scrollRoot, setScrollRoot] = React.useState<HTMLElement | null>(null);


  useLayoutEffect(() => {
    if (containerLazyLoadRef.current) {
      setScrollRoot(containerLazyLoadRef.current);
    }
  }, []);

  const {videos,videosLoading,handleSelectedVideo} = useYoutubeVideos(apiKey,totalVideosToFetch,sentinelRef,{
    root: scrollRoot,
    rootMargin: '350px',

  })

  return (
    <div
      className="h-screen flex flex-col overflow-y-auto"
      ref={containerLazyLoadRef}
    >
      {!isLoggedIn && <NotLoggedInBanner />}

      {isLoggedIn && (
        <>
          <div
            className={`${videos.length === 0 && 'hidden'} min-h-fit  w-full grid grid-flow-row gap-8  mt-8 p-6`}
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
                className=" min-h-fit  w-full  grid grid-flow-row mt-8  p-6 gap-10 "
                style={{
                  gridTemplateColumns: `repeat(${videosPerRow}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({
                  length:  totalVideosToFetch,
                }).map((_, index) => (
                  <VideoCardLoading key={`loading-${index}`} style=" aspect-video rounded-lg bg-neutral-200 dark:dark-modal" />
                ))}
              </div>
              <div className="flex w-full justify-center items-center ">
                <div className="min-h-9 min-w-9  h-9 w-9 border-2 rounded-full animate-spin  duration-75 dark:border-slate-300 dark:border-t-black border-grey  border-t-white" />
              </div>
            </>
          )}
        </>
      )}
      {/* intersection observer */}
      <div ref={sentinelRef}/>
    </div>
  );
};
