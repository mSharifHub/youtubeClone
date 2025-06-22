import React, { useEffect, useMemo, useRef, useState } from 'react';
import { sliceText } from '../helpers/sliceText.ts';
import timeSince from '../helpers/timeSince.ts';
import { convertISO } from '../helpers/convertISO.ts';
import decrementTime from '../helpers/decrementTime.ts';
import { Video } from '../helpers/youtubeVideoInterfaces.ts';

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FunctionComponent<VideoCardProps> = ({ video }) => {
  const [hover, setHover] = useState<boolean>(false);

  const [remainingTime, setRemainingTime] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  const [originalTime, setOriginalTime] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  const timerRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const videoURL = `https://www.youtube.com/embed/${video.id.videoId}?autoplay=1&mute=1&controls=0`;

  const videoTitle = sliceText({ s: video.snippet.title });

  const formatDuration = () => {
    if (!remainingTime) return '0:00';

    const { hours, minutes, seconds } = remainingTime;

    return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}` : `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  const publishedTime = useMemo(() => timeSince(video.snippet.publishedAt), [video.snippet.publishedAt]);

  const handleMouseEnter = () => {
    timeoutRef.current = window.setTimeout(() => {
      setHover(true);
    }, 350);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setHover(false);
    }
  };

  useEffect(() => {
    if (video.statistics?.duration) {
      const { hours, minutes, seconds } = convertISO(video.statistics.duration);
      const timeObj = { hours, minutes, seconds };
      setRemainingTime(timeObj);
      setOriginalTime(timeObj);
    }
  }, [video.statistics?.duration]);

  useEffect(() => {
    if (hover) {
      timerRef.current = window.setInterval(() => {
        decrementTime(setRemainingTime, timerRef);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (originalTime) setRemainingTime(originalTime);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hover, originalTime]);

  return (
    <div className=" rounded-xl flex flex-col cursor-pointer  group ">
      <div className=" relative aspect-video rounded-xl overflow-hidden bg-black" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {!hover ? (
          <img
            src={video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.default?.url}
            alt={video.snippet.title}
            className="w-full h-full object-cover rounded-xl"
            draggable={false}
          />
        ) : (
          <iframe
            className="absolute inset-0 w-full h-full rounded-xl "
            src={`${videoURL}`}
            allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
            title={video.snippet.title}
          />
        )}
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-1.5 py-0.5 rounded">{formatDuration()}</span>
      </div>
      <section className="flex flex-row h-28 mt-4 gap-4 ">
        <div className="flex-shrink-0  flex justify-center items-start">
          <img
            src={video.snippet.channelLogo || '../src/assets/thumbnails/icons8-video-100.png'}
            alt={video.snippet.channelTitle}
            className="h-12 w-12 object-cover rounded-full"
          />
        </div>
        <div className=" flex flex-col gap-1 flex-grow">
          <div className=" flex min-h-fit  text-sm  md:text-md xl:text-lg text-wrap">{videoTitle}</div>
          <div className="flex  flex-col min-h-fit text-sm dark:text-neutral-400 ">
            <h3> {video.snippet.channelTitle}</h3>
            <div className=" flex flex-row  space-x-2">
              <h3>
                {video.statistics?.viewCount} {video.statistics?.viewCount && parseInt(video.statistics.viewCount, 10) > 1 ? <span> views</span> : <span>view</span>}
              </h3>
              <h3>
                <span className="font-bold">&#8226;</span>
                {publishedTime}
              </h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
