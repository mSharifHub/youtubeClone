import React from 'react';
import { useUser } from '../../userContext/UserContext.tsx';
import { NotLoggedInBanner } from '../NotLoggedInBanner.tsx';
import useYoutubeVideos from '../hooks/useYoutubeVideos.ts';
import { useVideoGrid } from '../hooks/useVideosGrid.ts';
import dummyData from '../../../dummyData.json';
import { VideoCard } from '../VideoCard.tsx';
import { VideoCardLoading } from '../VideoCardLoading';

export const Home: React.FC = () => {
  const {
    state: { isLoggedIn },
  } = useUser();

  const api_key: string = import.meta.env.VITE_YOUTUBE_API_3;

  // Using the useVideo hook to control number of videos show per screen size
  const videosPerRow = useVideoGrid();

  const totalVideosToShow = videosPerRow * 2;

  const { videos, loading, error, playVideo, selectedVideoId } =
    useYoutubeVideos(api_key, 2);

  function handleVideoClick(videoId: string) {
    playVideo(videoId);
  }

  return (
    <div className="h-screen flex justify-center items-start overflow-y-auto scroll-smooth ">
      {!isLoggedIn && <NotLoggedInBanner />}

      {isLoggedIn && (
        <div
          className={`min-h-fit w-full grid grid-flow-row auto-rows-auto gap-8 md:gap-2  md:p-2 overflow-hidden`}
          style={{
            gridTemplateColumns: `repeat(${videosPerRow},minmax(0,1fr))`,
          }}
        >
          {videos
            .slice(0, totalVideosToShow)
            .map((video) =>
              !loading ? (
                <VideoCard
                  key={`${video.id.videoId}-${video.snippet.title}`}
                  video={video}
                />
              ) : (
                <VideoCardLoading
                  key={`${video.id.videoId}-${video.snippet.title}`}
                />
              ),
            )}
        </div>
      )}
    </div>
  );
};
