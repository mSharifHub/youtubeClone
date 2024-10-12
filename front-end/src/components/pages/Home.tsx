import React, { useEffect, useState } from 'react';
import { useUser } from '../../userContext/UserContext.tsx';
import { NotLoggedInBanner } from '../NotLoggedInBanner.tsx';
import useYoutubeVideos from '../hooks/useYoutubeVideos.ts';
import dummy_videos from '../../../dummyData.json';
import { useVideoGrid } from '../hooks/useVideosGrid.ts';

export const Home: React.FC = () => {
  const {
    state: { isLoggedIn },
  } = useUser();

  const api_key: string = import.meta.env.VITE_YOUTUBE_API_3;

  // Using the useVideo hook to control number of videos show per screen size
  const videosPerRow = useVideoGrid();

  const totalVideosToShow = videosPerRow * 2;

  const { videos, loading, error, playVideo, selectedVideoId } =
    useYoutubeVideos(api_key, 10);

  function handleVideoClick(videoId: string) {
    playVideo(videoId);
  }

  return (
    <>
      {/* Main Home Frame */}
      <div className="h-screen overflow-hidden flex justify-center items-start ">
        {!isLoggedIn && <NotLoggedInBanner />}

        {/* first row of videos */}
        <div
          className={` h-[600px] w-full  grid  grid-rows-2  gap-4 p-4  overflow-hidden border`}
          style={{
            gridTemplateColumns: `repeat(${videosPerRow},minmax(0,1.5fr))`,
          }}
        >
          {dummy_videos.videos.slice(0, totalVideosToShow).map((video) => (
            <div
              key={video.id.videoId}
              className="flex  flex-col justify-center items-center rounded-lg border "
            >
              {/*{selectedVideoId === id.videoId ? (*/}
              {/*  <iframe*/}
              {/*    width="560"*/}
              {/*    height="315"*/}
              {/*    src={`https://www.youtube.com/embed/${id.videoId}`}*/}
              {/*    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"*/}
              {/*    allowFullScreen*/}
              {/*    title="YouTube Video Player"*/}
              {/*  ></iframe>*/}
              {/*) : (*/}
              <img
                src={video.snippet.thumbnails?.default?.url}
                alt={video.snippet.title}
                onClick={() => handleVideoClick(video.id.videoId)}
                className="invert pointer"
              />
              {/*)}*/}
              <div className="font-bold text-lg  text-center">
                {video.snippet.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
