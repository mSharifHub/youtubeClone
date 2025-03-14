import React, { useEffect, useRef, useState } from 'react';
import { sliceText } from '../helpers/sliceText.ts';
import timeSince from '../helpers/timeSince.ts';
import { Video } from '../hooks/useYoutubeVideos.ts';
import { convertISO } from '../helpers/convertISO.ts';
import decrementTime from '../helpers/decrementTime.ts';

/**
 * Represents the properties for a VideoCard component.
 *
 * @interface VideoCardProps
 *
 * @property {Video} video - The video object to display in the VideoCard.
 * @property {string | undefined} [style] - Optional custom styling for the card.
 * @property {boolean | undefined} [shorts] - Optional flag to indicate if the video is a short.
 */
interface VideoCardProps {
  video: Video;
  style?: string | undefined;
  shorts?: boolean | undefined;
}

/**
 * Designed to render a video card with dynamic features, such as
 * thumbnail previews, hover-based video playback, and video/channel information display. The
 * component integrates functionalities for automatic video preview on hover, remaining time
 * countdown during a video preview, and structured video details, including channel logo,
 * video title, views count, and published time.
 *
 * Props:
 * - `video`: An object representing the video data, including details like ID, title, thumbnails,
 *   statistics, and channel information.
 * - `shorts`: A boolean value indicating whether the video is a short-form video. Determines
 *   the dimensions of the video preview container.
 *
 * Note:
 * - The component provides interactive behavior such as initiating a video preview on hover
 *   and displaying a countdown of the remaining video time during playback.
 * - This component uses `useState`, `useRef`, and `useEffect` hooks for state management and
 *   handling side effects related to hover and timer logic.
 */
export const VideoCard: React.FunctionComponent<VideoCardProps> = ({ video, shorts }) => {
  /**
   * it will exchange between the thumbnails and the video preview
   */
  const [hover, setHover] = useState<boolean>(false);

  /**
   *  object time used along with the decrement time function
   *@see decrementTime {function} ./helpers/decrementTime.ts
   */
  const [remainingTime, setRemainingTime] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  /**
   * state to reset to its original time when user is no longer hovering over the video div
   */
  const [originalTime, setOriginalTime] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  const timerRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  /**
   * A string representing the URL for embedding a YouTube video.
   * The URL is constructed dynamically using the provided video ID
   * and includes query parameters to control playback options.
   *
   * - `autoplay=1` ensures the video starts playing automatically.
   * - `mute=1` mutes the audio when the video starts.
   * - `controls=0` hides the video player controls.
   */
  const videoURL = `https://www.youtube.com/embed/${video.id.videoId}?autoplay=1&mute=1&controls=0`;

  /**
   * Handles the mouse enter event by initiating a delayed action.
   *
   * This function sets a timeout, which after a delay of 500 milliseconds,
   * triggers the state update to indicate a hover action. It uses a reference
   * to store the timeout ID, allowing for potential cleanup or manipulation of
   * the timeout later.
   */
  const handleMouseEnter = () => {
    timeoutRef.current = window.setTimeout(() => {
      setHover(true);
    }, 500);
  };

  /**
   * A function that handles the mouse leave event. It clears the timeout if it exists,
   * resets the timeout reference to null, and updates the hover state to false.
   */
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setHover(false);
    }
  };

  // Initializing remaining time
  useEffect(() => {
    if (video.statistics?.duration) {
      const { hours, minutes, seconds } = convertISO(video.statistics.duration);
      const timeObj = { hours, minutes, seconds };
      setRemainingTime(timeObj);
      setOriginalTime(timeObj);
    }
  }, [video.statistics?.duration]);

  /*
   * Use effect to handle  time state
   */
  useEffect(() => {
    /**
     * Initializes and starts a timer that executes a decrement function
     * at a regular interval of 1 second. If the timer is already running,
     * this function does nothing.
     *
     * This function uses a reference `timerRef` to persist and manage the
     * timer's state and prevents multiple timers from being created.
     *
     * The `decrementTime` function is called within the timer's operation to
     * handle time decrement logic, utilizing the passed `setRemainingTime`
     * function and `timerRef`.
     */
    const starterTime = () => {
      if (!timerRef.current) {
        timerRef.current = window.setInterval(() => {
          decrementTime(setRemainingTime, timerRef);
        }, 500);
      }
    };
    /**
     * Stops the active timer by clearing the interval associated with `timerRef.current`.
     * If a timer is running (i.e., `timerRef.current` is not null or undefined), it clears the interval
     * using `clearInterval` and sets `timerRef.current` to null to signify that the timer has stopped.
     */
    const stopTime = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current as number);
        timerRef.current = null;
      }
    };
    if (hover) {
      starterTime();
    } else {
      stopTime();
    }
    setRemainingTime(originalTime);

    return () => {
      clearInterval(timerRef.current as number);
    };
  }, [hover, originalTime]);

  const videoTitle = sliceText({ s: video.snippet.title });

  return (
    <>
      <div className=" flex flex-col  cursor-pointer ">
        {/* video thumbnails*/}
        <div
          className={`relative grow flex justify-center items-center   aspect-video`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {!hover && (
            <img
              src={video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.default?.url}
              alt={`thumbnail-${video.snippet.title}`}
              className={` absolute inset-0  rounded-xl h-full w-full  ${shorts ? 'object-cover  object-center ' : '  object-fill '}  `}
            />
          )}

          {hover && (
            <iframe
              className="absolute inset-0  h-full w-full rounded-xl "
              src={`${videoURL}`}
              allow="autoplay; encrypted-media; gyroscope; picture-in-picture; "
            />
          )}
          <div
            className="absolute bottom-0 right-4 px-2 py-1 rounded-lg "
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#ffffff' }}
          >
            {remainingTime ? `${remainingTime.hours}:${remainingTime.minutes}:${remainingTime.seconds}` : '0:00:00'}
          </div>
        </div>
        {/* video and channel information*/}
        {!shorts && (
          <div className="flex flex-shrink justify-start items-center  space-x-4">
            {/*channel logo*/}
            <div className="min-h-10 min-w-10 h-10 w-10">
              <img
                src={video.snippet.channelLogo || '../src/assets/thumbnails/icons8-video-100.png'}
                alt={video.snippet.channelLogo ? video.snippet.channelTitle : ''}
                className="h-full w-full rounded-full"
              />
            </div>
            {/*video info*/}
            <div className="h-24 w-full flex flex-col p-1 flex-initial ">
              <div className=" flex-shrink text-sm  md:text-md xl:text-lg text-wrap">{videoTitle}</div>
              {/*channel title and views*/}
              <div className="flex-grow flex-col text-sm dark:text-neutral-400">
                <div>{video.snippet.channelTitle}</div>
                {/*video views */}
                <div className="">
                  {video.statistics?.viewCount}
                  {video.statistics?.viewCount && parseInt(video.statistics.viewCount, 10) > 1 ? (
                    <span> views</span>
                  ) : (
                    <span>view</span>
                  )}
                  {/*published at */}
                  <span className="">
                    <span className="font-bold">&#8226;</span>
                    <span>{timeSince(video.snippet.publishedAt)}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
