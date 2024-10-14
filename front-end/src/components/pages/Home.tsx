import React from 'react';
import { useUser } from '../../userContext/UserContext.tsx';
import { NotLoggedInBanner } from '../NotLoggedInBanner.tsx';
import useYoutubeVideos from '../hooks/useYoutubeVideos.ts';
import { useVideoGrid } from '../hooks/useVideosGrid.ts';
import dummyData from '../../../dummyData.json';
import { sliceText } from '../helpers/sliceText.ts';
import timeSince from '../helpers/timeSince.ts';

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
      <div className="h-screen flex justify-center items-start overflow-y-auto scroll-smooth ">
        {!isLoggedIn && <NotLoggedInBanner />}

        {/* First row of videos */}
        {isLoggedIn && (
          <div
            className={`min-h-fit w-full grid grid-flow-row auto-rows-auto gap-8 md:gap-2  md:p-2 overflow-hidden`}
            style={{
              gridTemplateColumns: `repeat(${videosPerRow},minmax(0,1fr))`,
            }}
          >
            {dummyData.videos.slice(0, totalVideosToShow).map((video) => (
              <>
                {/* Main video card */}
                <div
                  key={`${video.id.videoId}-${video.snippet.channelTitle}`}
                  className="flex flex-col flex-wrap"
                >
                  {/* video thumbnails*/}
                  <img
                    src={video.snippet.thumbnails?.default?.url}
                    alt={video.snippet.title}
                    className=" h-[400px] sm:h-[300px] md:h-[200px] w-full  border  rounded-lg object-contain"
                  />

                  {/* video and channel information*/}
                  <div className="flex flex-initial p-2 space-x-2  ">
                    {/*channel logo*/}
                    <div className="flex min-w-12 min-h-12 justify-center items-start">
                      {/*channel logo image*/}
                      <img
                        src={video.snippet.channelLogo}
                        alt={video.snippet.title}
                        className="h-12 w-12 rounded-full "
                      />
                    </div>
                    {/*video title*/}
                    <div className="flex flex-col justify-center items-start w-full ">
                      {sliceText(video.snippet.title)}
                      {/*channel title and views*/}
                      <div className="flex flex-col w-full text-sm dark:text-neutral-400">
                        <div>{video.snippet.channelTitle}</div>
                        {/*video views */}
                        <div className="flex flex-row gap-x-2">
                          {video.statistics?.viewCount}
                          {video.statistics?.viewCount &&
                          parseInt(video.statistics.viewCount, 10) > 1 ? (
                            <span> views</span>
                          ) : (
                            <span>view</span>
                          )}
                          {/*published at */}
                          <span className="space-x-2">
                            <span className="font-bold">&#8226;</span>
                            <span>{timeSince(video.snippet.publishedAt)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
