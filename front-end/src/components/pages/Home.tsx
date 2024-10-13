import React from 'react';
import { useUser } from '../../userContext/UserContext.tsx';
import { NotLoggedInBanner } from '../NotLoggedInBanner.tsx';
import useYoutubeVideos from '../hooks/useYoutubeVideos.ts';
import { useVideoGrid } from '../hooks/useVideosGrid.ts';
import dummyData from '../../../dummyData.json';
import { sliceText } from '../../helpers/sliceText.ts';

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

  console.log('debugging videos', videos);

  function handleVideoClick(videoId: string) {
    playVideo(videoId);
  }

  return (
    <>
      {/* Main Home Frame */}
      <div className="h-screen overflow-hidden flex justify-center items-start  ">
        {!isLoggedIn && <NotLoggedInBanner />}

        {/* first row of videos */}
        {isLoggedIn && (
          <div
            className={` h-[600px] w-full  grid  grid-rows-2  gap-4 p-2   overflow-hidden border border-amber-400`}
            style={{
              gridTemplateColumns: `repeat(${videosPerRow},minmax(0,1fr))`,
            }}
          >
            {dummyData.videos.slice(0, totalVideosToShow).map((video) => (
              <>
                {/*video container*/}
                <div
                  key={video.id.videoId}
                  className="grid grid-rows-[1fr,0.5fr] rounded-lg border"
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

                  {/* row1 contains video thumbnail*/}
                  <img
                    src={video.snippet.thumbnails?.default?.url}
                    alt={video.snippet.title}
                    onClick={() => handleVideoClick(video.id.videoId)}
                    className="row-span-1 row-start-1 flex-grow  p-2 h-full w-full rounded-lg shadow-lg  object-contain "
                  />

                  {/*row2:{col1,col2} */}
                  <div className="row-start-2 row-span-1 grid grid-cols-[0.20fr,1fr]">
                    {/* col1 containing the channel logo */}
                    <div className=" col-start-1 col-span-1 flex  flex-initial h-full justify-center items-start border">
                      <img
                        src={video.snippet.channelLogo}
                        alt={video.snippet.channelTitle}
                        className=" min-h-12 min-w-12 h-12 w-12 rounded-full"
                      />
                    </div>

                    {/*col2:{row1,row2 */}
                    <div className="col-span-2 col-start-2 grid grid-rows-[1fr,0.25fr]  border">
                      {/* row1: video title */}
                      <div className="row-start-1 row-span-1  flex justify-start flex-initial min-h-fit flex-wrap items-center text-wrap text-sm font-bold">
                        {sliceText(video.snippet.title)}
                      </div>
                      {/* row2:channel name and statistics */}
                      <div className="row-span-1 row-start-2 flex-wrap min-h-fit flex flex-col justify-start text-nowrap  text-sm border">
                        <div>{video.snippet.channelTitle}</div>
                        <div>{video.statistics?.viewCount} views</div>
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
