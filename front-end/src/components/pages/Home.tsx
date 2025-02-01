import React, { useRef } from 'react';
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
  const [hasMore, setHasMore] = useState<boolean>(true);
  const containerLazyLoadRef = useRef<HTMLDivElement | null>(null);

  // useState to check if user is logged in
  const {
    state: { isLoggedIn },
  } = useUser();
  // This api key is to use along with use hook youtube videos
  const apiKey = import.meta.env.VITE_YOUTUBE_API_3;

  // changes the number of video columns as the screen width changes
  const videosPerRow = useVideoGrid(firstVideoRowsDisplayValues);

  // changes the columns for the shorts rows as the screen width changes
  const shortsVideosPerRow = useVideoGrid(firstShortsRowsDisplayValues);

  // This will make the first batch of videos rows
  const totalVideosFirstRow = videosPerRow ? videosPerRow * 2 : 0;

  const VIDEOS_PER_LOAD = totalVideosFirstRow;

  /* For debugging use the dummy data to not exceed Youtube's api limit*/
  const { videos } = dummyData;
  const firstRowVideos = videos.slice(0, totalVideosFirstRow);
  const shortsVideosRow = videos.slice(0, shortsVideosPerRow);
  const isLoading = false;
  /* end of debugging*/

  return (
    <div className="h-full flex flex-col justify-start items-start scroll-smooth overflow-y-auto border">
      {!isLoggedIn && <NotLoggedInBanner />}

      {isLoggedIn && (
        <>
          {/* first row of videos */}
          <div
            className={`min-h-fit flex-1 w-full grid grid-flow-row auto-rows-auto gap-8 md:gap-2  md:p-2`}
            style={{
              gridTemplateColumns: `repeat(${videosPerRow},minmax(0,1fr))`,
            }}
          >
            {firstRowVideos.map((video) =>
              !isLoading ? (
                <VideoCard
                  key={`${video.id.videoId}-${video.snippet.title}`}
                  video={video}
                  style="relative flex justify-center items-center h-[200px] rounded-lg border"
                />
              ) : (
                <VideoCardLoading
                  style=" relavtive  h-[200px] w-full rounded-lg  bg-neutral-200 dark:dark-modal"
                  key={`${video.id.videoId}-${video.snippet.title}`}
                />
              ),
            )}
          </div>

          {/*YouTube Shorts row */}
          <div className=" min-h-fit h-[800px] flex-1  w-full   ">
            {/*YouTube Shorts logo */}
            <div className="flex flex-row  justify-start items-center">
              <img
                src="https://img.icons8.com/?size=100&id=ot8QhAKun4rZ&format=png&color=000000"
                className="min-h-10 min-w-10 h-10 w-10"
                alt="YoutubeShorts"
              />
              <h1 className="font-bold  text-lg dark:dark-modal">Shorts</h1>
            </div>

            <div
              className="grid grid-flow-col gap-x-5  "
              style={{
                gridTemplateColumns: `repeat(${shortsVideosPerRow},minmax(0,1fr))`,
              }}
            >
              {shortsVideosRow.map((video) =>
                !isLoading ? (
                  <div
                    className=" h-full w-full   flex-1 justify-center items-center  border"
                    key={`${video.id.videoId}-${video.snippet.title}`}
                  >
                    <VideoCard
                      video={video}
                      style="relative flex justify-center items-center  h-[500px] rounded-lg "
                    />
                  </div>
                ) : (
                  <VideoCardLoading
                    style=" relative h-[500px] w-full rounded-lg  bg-neutral-200 dark:dark-modal"
                    key={`${video.id.videoId}-${video.snippet.title}`}
                  />
                ),
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
