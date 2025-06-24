import { useSelectedVideo } from '../../contexts/selectedVideoContext/SelectedVideoContext.ts';
import { YouTubeProps } from 'react-youtube';
import React from 'react';
import { decodeHtmlEntities } from '../helpers/decodeHtmlEntities.ts';
import { formatNumber } from '../helpers/formatNumber.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faShare } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';

export default function VideoCardPlayer({
  YoutubeComponent,
  opts,
  onReady,
}: {
  YoutubeComponent: React.ComponentType<YouTubeProps>;
  opts: YouTubeProps['opts'];
  onReady: YouTubeProps['onReady'];
}) {
  const { selectedVideo } = useSelectedVideo();

  return (
    <div className="min-h-fit h-fit w-full flex flex-col justify-start items-start space-y-4   rounded-lg">
      <div className="relative flex  flex-none w-full  min-h-[250px]   aspect-video ">
        <YoutubeComponent videoId={selectedVideo?.id.videoId} opts={opts} onReady={onReady} iframeClassName="absolute inset-0 h-full  w-full rounded-xl" />
      </div>
      {!selectedVideo ? (
        <div className="flex flex-row w-full space-x-8">
          <div className=" min-h-10 min-w-10 h-14 w-14  flex-none rounded-full bg-neutral-200 dark:dark-modal  animate-wave-opacity" />
          <div className=" flex flex-col w-full space-y-2 ">
            <div className=" h-6  w-full rounded bg-neutral-200 dark:dark-modal  animate-wave-opacity  " />
            <div className=" h-6  w-1/2 rounded bg-neutral-200 dark:dark-modal  animate-wave-opacity  " />
          </div>
        </div>
      ) : (
        <section className=" flex flex-col min-h-fit w-full p-4 space-y-4 ">
          {/* first-column */}
          <div className="flex-1 justify-start items-center">
            <h1 className="font-bold text-lg text-wrap "> {decodeHtmlEntities(selectedVideo?.snippet.title)}</h1>
          </div>
          {/* second-column */}
          <div className=" flex flex-row flex-wrap  gap-2">
            <div className="flex justify-start items-center gap-4 grow ">
              <img
                src={selectedVideo?.snippet.channelLogo}
                alt={selectedVideo?.snippet.channelTitle}
                className="h-14 w-14 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                loading="lazy"
              />
              <div className="flex flex-col">
                <h1 className="font-bold text-base text-gray-800 dark:text-gray-100 truncate">{decodeHtmlEntities(selectedVideo.snippet.channelTitle)}</h1>
                <div className=" flex flex-row items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatNumber(Number(selectedVideo.snippet.subscriberCount))}</span>
                  <span>subscribers</span>
                </div>
              </div>
              <button className=" px-5 bg-neutral-100  h-10 space-x-4 dark:bg-neutral-800 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-700">
                <FontAwesomeIcon icon={faBell} />
                <span>Subscribe</span>
              </button>
            </div>
            <div className="flex justify-end items-center gap-4 ">
              <div className="flex items-center bg-neutral-100 h-10 dark:bg-neutral-800 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-700">
                <button className="h-full flex items-center px-6   hover:bg-neutral-200 dark:hover:bg-neutral-700 transition">
                  <FontAwesomeIcon icon={faThumbsUp} />
                </button>
                <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700" />
                <button className=" h-full flex items-center px-6  hover:bg-neutral-200 dark:hover:bg-neutral-700 transition">
                  <FontAwesomeIcon icon={faThumbsDown} className="-scale-x-100" />
                </button>
              </div>
              <button className="px-4 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition">
                <FontAwesomeIcon icon={faShare} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
