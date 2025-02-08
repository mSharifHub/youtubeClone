import React, { useEffect, useRef, useState } from 'react';
import { sliceText } from './helpers/sliceText.ts';
import timeSince from './helpers/timeSince.ts';
import { Video } from './hooks/useYoutubeVideos.ts';
import { convertISO } from './helpers/convertISO.ts';
import decrementTime from './helpers/decrementTime.ts';

interface VideoCardProps {
  video: Video;
  style:string| undefined
}

export const VideoCard: React.FunctionComponent<VideoCardProps> = ({
  video,
  style,
}) => {
  // state to play video on hover
  const [hover, setHover] = useState<boolean>(false);

  const [remainingTime, setRemainingTime] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  const [originalTime, setOriginalTime] = useState<{
    hours:number;
    minutes:number;
    seconds:number;
  }| null>(null)


  const timerRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const videoURL = `https://www.youtube.com/embed/${video.id.videoId}?autoplay=1&mute=1&controls=0`;

  const handleMouseEnter = () => {

    timeoutRef.current = window.setTimeout(()=>{
      setHover(true);
    },500)

  };

  const handleMouseLeave = () => {
    if (timeoutRef.current){
      clearTimeout(timeoutRef.current);
      setHover(false);
    }

  };

  // Initializing remaining time
  useEffect(() => {
    if (video.statistics?.duration) {
      const { hours, minutes, seconds } = convertISO(video.statistics.duration);

      const timeObj = {hours, minutes, seconds};
      setRemainingTime(timeObj);
      setOriginalTime(timeObj);

    }
  }, [video.statistics?.duration]);

  // Updating timer on hover
  useEffect(() => {
    if (hover) {
      timerRef.current = window.setInterval(() => {
        decrementTime(setRemainingTime, timerRef);
      }, 1000);
    } else {
      clearInterval(timerRef.current as number);
      timerRef.current = null;
      setRemainingTime(originalTime);
    }
    return () => {
      clearInterval(timerRef.current as number);
    };
  }, [hover,originalTime]);

  return (
    <div className="flex flex-col flex-wrap cursor-pointer">
      {/* video thumbnails*/}

      <div
        className={style}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {!hover && (
          <img
            src={video.snippet.thumbnails?.medium?.url}
            alt={video.snippet.title}
            className={` absolute  inset-0 h-full w-full rounded-xl object-cover  ease-linear `}
          />
        )}

        {hover && (
          <iframe
            className="absolute  inset-0 h-full w-full rounded-xl  "
            src={videoURL}
            allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
          />
        )}
        <div className="absolute bottom-0 right-4 px-2 py-1 rounded-lg "
             style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#ffffff' }}>

          {remainingTime
            ? `${remainingTime.hours}:${remainingTime.minutes}:${remainingTime.seconds}`
            : '0:00:00'}
        </div>
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
