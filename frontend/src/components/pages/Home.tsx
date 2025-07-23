import React, { useEffect, useRef } from 'react';
import { NotLoggedInBanner } from '../bannerComponents/NotLoggedInBanner.tsx';
import { VideoCard } from '../VideoComponents/VideoCard.tsx';
import { VideoCardLoading } from '../VideoComponents/VideoCardLoading.tsx';
import useYoutubeVideos from '../hooks/useYoutubeVideos.ts';
import { useVideoGrid } from '../hooks/useVideosGrid.ts';
import { videosPerRowDisplayValues } from '../../helpers/homeVideoDisplayOptions.ts';
import SpinningCircle from '../VideoComponents/SpinningCircle.tsx';
import { useUser } from '../../contexts/userContext/UserContext.tsx';
import { useHandleSelectedVideo } from '../hooks/useHandleSelectedVideo.ts';
export const Home: React.FC = () => {

  const apiKey: string = import.meta.env.VITE_YOUTUBE_API_3;
  const videosPerRow = useVideoGrid(videosPerRowDisplayValues)

  const { videos, videosLoading,sentinelRef} = useYoutubeVideos(apiKey, 10)

  const handleSelectedVideo = useHandleSelectedVideo()

  const containerRef = useRef<HTMLDivElement | null>(null);

  const fullRowCount = Math.floor(videos.length / (videosPerRow ?? 1)) * (videosPerRow ?? 1);

  const {state:{isLoggedIn}, loadingQuery} = useUser()


  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, []);

  if (loadingQuery) return null;

  return(

    isLoggedIn ?
        (
          <div ref={containerRef} className="  h-screen overflow-y-scroll scroll-smooth  px-4 pt-6 ">
              <ul className="grid grid-flow-row gap-4 "
                  style={{
                    gridTemplateColumns: `repeat(${videosPerRow}, minmax(0, 1fr))`,
                  }}
              >
                {
                  videos.slice(0,fullRowCount).map((video) => (
                    <li key={video.id.videoId}   onClick={() => handleSelectedVideo(video)} ><VideoCard video={video} /></li>
                  ))
                }
              </ul>

            {/*/!*Sentinel Observer*!/*/}
              <div className="h-4" ref={sentinelRef}/>

              {videosLoading && (
                <>
                  <ul
                    className=" grid grid-flow-row gap-4"
                    style={{
                      gridTemplateColumns: `repeat(${videosPerRow}, minmax(0, 1fr))`,
                    }}
                  >
                    {Array.from({
                      length: videosPerRow * 2,
                    }).map((_, index) => (
                      <li key={`loading-${index}`}>
                        <VideoCardLoading  />
                      </li>
                    ))}
                  </ul>
                  <SpinningCircle/>
                </>
              )}
            </div>
        )
      :
      (
        <div className=" h-screen  flex flex-col justify-start items-center ">
          <NotLoggedInBanner/>
        </div>
      )

  )
}


