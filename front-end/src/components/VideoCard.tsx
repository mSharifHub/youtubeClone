import React, { useState } from 'react';
import { sliceText } from './helpers/sliceText.ts';
import timeSince from './helpers/timeSince.ts';
import { Video } from './hooks/useYoutubeVideos.ts';

interface VideoCardProps {
  video: Video;
}

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const VideoCard: React.FunctionComponent<VideoCardProps> = ({
  video,
}) => {
  const [hover, setHover] = useState<boolean>(false);

  const videoURL = `https://www.youtube.com/embed/${video.id.videoId}?autoplay=1&mute=1&controls=0`;

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  return (
    <div className="flex flex-col flex-wrap">
      {/* video thumbnails*/}

      <div
        className="relative h-[400px] sm:h-[300px] md:h-[200px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {!hover && (
          <img
            src={video.snippet.thumbnails?.medium?.url}
            alt={video.snippet.title}
            className={` absolute  inset-0 h-full w-full rounded-xl object-fill  transition-opacity duration-100 ease-linear cursor-pointer`}
          />
        )}

        {hover && (
          <iframe
            className={`absolute  inset-0 h-full w-full rounded-xl  transition-opacity duration-100 ease-linear cursor-pointer`}
            src={videoURL}
            allow="autpplay; encrypted-media; gyroscope; picture-in-picture"
          />
        )}
      </div>

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
  );
};
