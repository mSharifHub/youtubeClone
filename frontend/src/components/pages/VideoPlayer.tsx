import React, { useRef, useState } from 'react';
import YouTube, { YouTubePlayer, YouTubeProps } from 'react-youtube';
import { useSelectedVideo } from '../../contexts/selectedVideoContext/SelectedVideoContext.ts';
import { formatNumber } from '../helpers/formatNumber.ts';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sliceText } from '../helpers/sliceText.ts';

export const VideoPlayer: React.FC = () => {
  const { selectedVideo } = useSelectedVideo();

  const playerRef = useRef<YouTubePlayer | null>(null);

  const [expand, setExpand] = useState<boolean>(false);

  const opts: YouTubeProps['opts'] = {
    playerVars: {
      autoplay: 0,
      controls: 1,
      fs: 1,
      rel: 0,
      modestbranding: 1,
    },
  };

  const handleExpand = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setExpand((prev) => !prev);
  };

  const onReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
  };

  const YoutubeComponent = YouTube as YouTubeProps as React.FC<YouTubeProps>;

  return (
    <div className="h-screen flex justify-center items-start  overflow-y-scroll scroll-smooth  p-8 space-x-12 no-scrollbar border">
      <>
        {/*video section and comments*/}
        <div className="min-h-fit h-fit max-w-[1200px] w-full flex flex-col justify-start items-start space-y-8 ">
          <div className=" relative flex  flex-none w-full  min-h-[200px] max-h-[700px] aspect-video ">
            <YoutubeComponent
              videoId={selectedVideo?.id.videoId}
              opts={opts}
              onReady={onReady}
              iframeClassName="absolute inset-0 h-full  w-full rounded-xl"
            />
          </div>
          {/* channel information */}
          <div className=" flex flex-col flex-none space-y-4 overflow-hidden mt-4 w-full">
            {/* video title */}
            <div className=" flex text-wrap text-lg font-bold"> {selectedVideo?.snippet.title}</div>
            {/* channel logo, name, statistics and like & share row */}
            <div className="flex  flex-wrap gap-y-4 ">
              {/* first column */}
              <div className="flex flex-row grow space-x-4">
                {/* channel logo */}
                <div className="flex flex-initial justify-center items-center">
                  <img
                    src={selectedVideo?.snippet.channelLogo}
                    alt={selectedVideo?.snippet.channelTitle}
                    className={`h-14 w-14  min-h-10 min-w-10 rounded-full `}
                  />
                </div>
                {/* channel title and statistics columns */}
                <div className="flex flex-col">
                  {/* channel title */}
                  <div>{selectedVideo?.snippet.channelTitle}</div>
                  {/* channel statistics subscriber */}
                  <div className="flex flex-row text-xs text-wrap space-x-2 dark:text-neutral-400 ">
                    <h3>{formatNumber(Number(selectedVideo?.snippet.subscriberCount))}</h3>
                    <h3>subscribers</h3>
                  </div>
                </div>
                {/* subscriber button */}
                <div className="flex justify-center items-center ">
                  <button className=" flex-initial  min-h-9 h-9  min-w-fit w-24  text-nowrap  p-2  rounded-full  text-xs  dark:bg-gray-100 dark:font-semibold  hover:dark:bg-gray-200 dark:text-black capitalize">
                    subscribe
                  </button>
                </div>
              </div>
              {/* second column */}
              <div className=" flex justify-start space-x-8 shrink items-center ">
                {/*like Button & unlike Button */}
                <div className=" flex flex-initial justify-center items-center">
                  {/*Thumbs Up Button */}
                  <button className=" min-h-9 h-9 min-w-fit w-24  p-2 flex justify-center items-center space-x-2 rounded-l-full  text-xs  font-semibold   border-r-2 border-neutral-600  dark:bg-neutral-700  hover:dark:bg-neutral-600 dark:bg-opacity-70 ">
                    <FontAwesomeIcon icon={faThumbsUp} size="xl" />
                    <h3>{formatNumber(Number(selectedVideo?.statistics?.likeCount))}</h3>
                  </button>
                  {/*Thumbs Down Button */}
                  <button className="min-h-9 h-9 min-w-fit w-12 p-2  flex justify-center  items-center rounded-r-full   dark:bg-neutral-700 hover:dark:bg-neutral-600   dark:bg-opacity-70">
                    <FontAwesomeIcon icon={faThumbsDown} size="lg" className="-scale-x-100" />
                  </button>
                </div>
                {/*share button */}
                <div className="flex justify-center items-center ">
                  <button className=" min-h-9 h-9   min-w-fit w-24 flex-initial flex  justify-center items-center  p-2  rounded-full  dark:bg-neutral-700 hover:dark:bg-neutral-600   dark:bg-opacity-70 text-sm capitalize">
                    share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/*description container*/}
          <div
            className={` relative ${expand ? 'h-fit' : 'h-16'} flex w-full flex-col p-4  overflow-hidden bg-neutral-100 dark:bg-neutral-800 rounded-lg  `}
          >
            {/* text container */}
            <div className="h-full flex-wrap text-wrap space-y-4 ">
              <h2>{selectedVideo?.snippet.channelDescription}</h2>
              <p>{selectedVideo?.snippet.description}</p>
            </div>
            {/*fading overlay*/}
            {!expand && (
              <div className="absolute inset-x-0  bottom-0   rounded-b-lg  h-12  bg-gradient-to-t from-white dark:from-darkTheme via-[rgba(255,255,255,0.5)] to-transparent pointer-events-none " />
            )}
            <button className="absolute right-4 bottom-0 font-semibold hover:text-neutral-500  dark:hover:text-neutral-200 z-10" onClick={handleExpand}>
              {expand ? 'show less' : '...more'}
            </button>
          </div>
        </div>

        <div className="hidden  min-h-fit h-fit lg:flex flex-col justify-start items-center  w-[600px] flex-shrink border border-amber-400">
          related video column
        </div>
      </>
    </div>
  );
};
