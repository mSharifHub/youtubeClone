import React, { useCallback, useEffect, useRef, useState } from 'react';
import YouTube, { YouTubePlayer, YouTubeProps } from 'react-youtube';
import { useSelectedVideo } from '../../contexts/selectedVideoContext/SelectedVideoContext.ts';
import { formatNumber } from '../helpers/formatNumber.ts';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { decodeHtmlEntities } from '../helpers/decodeHtmlEntities.ts';
import { useYoutubeComments } from '../hooks/useYoutubeComments.ts';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import useYoutubeVideos, { Video } from '../hooks/useYoutubeVideos.ts';
import { loadFromDB, saveToDB } from '../../utils/videoCacheDb/videoCacheDB.ts';
import { VideoCard } from '../VideoComponents/VideoCard.tsx';

export const VideoPlayer: React.FC = () => {
  const { selectedVideo } = useSelectedVideo();

  const playerRef = useRef<YouTubePlayer | null>(null);

  const [expandVideoDescription, setExpandVideoDescription] = useState<boolean>(false);
  const [showTopLevelReplies, setShowTopLevelReplies] = useState<boolean>(false);
  const [infScrollRelatedVideos, setInfScrollRelatedVideos] = useState<Video[]>([]);
  const [firstLoadRelatedVideos, setFirstLoadRelatedVideos] = useState<Video[]>([]);

  const apiKey: string = import.meta.env.VITE_YOUTUBE_API_3;
  const pagePaginationRef = useRef<HTMLDivElement | null>(null);
  const pageScrollSentinelRef = useRef(null);

  const opts: YouTubeProps['opts'] = {
    playerVars: {
      autoplay: 1,
      controls: 1,
      fs: 1,
      rel: 0,
      modestbranding: 1,
    },
  };

  const handleExpandVideoDescription = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setExpandVideoDescription((prev) => !prev);
  };

  const handleShowTopLevelReplies = (): void => {
    setShowTopLevelReplies((prev) => !prev);
  };

  const onReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
  };

  const YoutubeComponent = YouTube as YouTubeProps as React.FC<YouTubeProps>;

  const { comments, commentsLoading, commentsError, fetchComments, hasMore, topLevelCount, commentsPageToken } =
    useYoutubeComments(apiKey, 10);

  const { relatedVideos: fetchRelatedVideos, loading, error, nextPageToken, handleSelectedVideo } = useYoutubeVideos(apiKey, 10);

  const handleFirstLoadRelatedVideos = useCallback(async () => {
    try {
      const cachedVideos = await loadFromDB('relatedVideosFirstLoad');
      if (cachedVideos.length > 0) {
        setFirstLoadRelatedVideos(cachedVideos);
      } else {
        if (selectedVideo && selectedVideo.snippet.categoryId) {
          const videos = await fetchRelatedVideos(selectedVideo.snippet.categoryId);
          if (videos && videos.length > 0) {
            await saveToDB('relatedVideosFirstLoad', videos);
            setFirstLoadRelatedVideos(videos);
          }
        }
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'an error occurred fetching related videos');
    }
  }, [selectedVideo]);

  const handleRelatedVideosScroll = useCallback(async () => {
    if (loading || infScrollRelatedVideos.length >= 20 || error) return;
    try {
      if (nextPageToken && selectedVideo && selectedVideo.snippet.categoryId) {
        const newVideos = await fetchRelatedVideos(selectedVideo.snippet.categoryId, nextPageToken);

        if (!newVideos || newVideos.length === 0) {
          return;
        } else {
          setInfScrollRelatedVideos((prev) => {
            const unique = newVideos.filter((newVideo) => !prev.some((existing) => existing.id.videoId === newVideo.id.videoId));
            const updated = [...prev, ...unique];
            saveToDB('relatedVideos', updated);
            return updated;
          });
        }
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : ' an error occurred');
    }
  }, [loading, error, nextPageToken]);

  const handlePagination = useCallback(() => {
    if (commentsLoading || commentsError || !hasMore || !selectedVideo || topLevelCount >= 50) return;
    fetchComments(selectedVideo.id.videoId, commentsPageToken);
  }, [commentsLoading, commentsError, hasMore, selectedVideo, topLevelCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          handlePagination();
          // handleRelatedVideosScroll();
        }
      },
      {
        root: pagePaginationRef.current,
        rootMargin: '100px',
        threshold: 0,
      },
    );

    if (pageScrollSentinelRef.current) {
      observer.observe(pageScrollSentinelRef.current);
    }

    return () => {
      if (pageScrollSentinelRef.current) {
        observer.unobserve(pageScrollSentinelRef.current);
      }
    };
  }, [handlePagination, handleRelatedVideosScroll]);

  /*
 Handles first load of messages
  */
  useEffect(() => {
    if (selectedVideo?.id.videoId) {
      fetchComments(selectedVideo.id.videoId);
    }
  }, []);

  /*
  Handles First Load of Related Videos
   */
  useEffect(() => {
    const checkLoad = async () => {
      const videos = await loadFromDB('relatedVideosFirstLoad');
      if (!videos) {
        await handleFirstLoadRelatedVideos();
      }
    };
    checkLoad();
  }, [handleFirstLoadRelatedVideos]);

  return (
    <div ref={pagePaginationRef} className="h-screen flex flex-col overflow-y-scroll scroll-smooth no-scrollbar ">
      <div className="flex justify-center items-start  p-8 space-x-14 ">
        <>
          {/*video section and comments*/}
          <div className="min-h-fit h-fit max-w-[1200px] w-full flex flex-col justify-start items-start space-y-8  ">
            <div className="relative flex  flex-none w-full  min-h-[200px] max-h-[700px] aspect-video ">
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
              <div className=" flex text-wrap text-lg font-bold"> {decodeHtmlEntities(selectedVideo?.snippet?.title)}</div>
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
                    <div>{decodeHtmlEntities(selectedVideo?.snippet.channelTitle)}</div>
                    {/* channel statistics subscriber */}
                    <div className="flex flex-row text-xs text-wrap space-x-2 dark:text-neutral-400 ">
                      <h3>{formatNumber(Number(decodeHtmlEntities(selectedVideo?.snippet.subscriberCount)))}</h3>
                      <h3>subscribers</h3>
                    </div>
                  </div>
                  {/* subscriber button */}
                  <div className="flex justify-center items-center ">
                    <button className=" flex-initial  min-h-9 h-9  min-w-fit w-24  text-nowrap  p-2  rounded-full  text-xs  bg-neutral-100 dark:bg-gray-100 dark:font-semibold  hover:dark:bg-gray-200  hover:bg-neutral-200 font-medium dark:text-black capitalize">
                      subscribe
                    </button>
                  </div>
                </div>
                {/* second column */}
                <div className=" flex justify-start space-x-8 shrink items-center ">
                  {/*like Button & unlike Button */}
                  <div className=" flex flex-initial justify-center items-center">
                    {/*Thumbs Up Button */}
                    <button className=" min-h-9 h-9 min-w-fit w-24  p-2 flex justify-center items-center space-x-2 rounded-l-full  text-xs  font-semibold   border-r-2 dark:border-neutral-600  bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700  hover:dark:bg-neutral-600 dark:bg-opacity-70 ">
                      <FontAwesomeIcon icon={faThumbsUp} size="xl" />
                      <h3>{formatNumber(Number(selectedVideo?.statistics?.likeCount))}</h3>
                    </button>
                    {/*Thumbs Down Button */}
                    <button className="min-h-9 h-9 min-w-fit w-12 p-2  flex justify-center  items-center rounded-r-full   bg-neutral-100 hover:bg-neutral-200   dark:bg-neutral-700 hover:dark:bg-neutral-600   dark:bg-opacity-70">
                      <FontAwesomeIcon icon={faThumbsDown} size="lg" className="-scale-x-100" />
                    </button>
                  </div>
                  {/*share button */}
                  <div className="flex justify-center items-center ">
                    <button className=" min-h-9 h-9   min-w-fit w-24 flex-initial flex  justify-center items-center  p-2  rounded-full    bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 hover:dark:bg-neutral-600   dark:bg-opacity-70 text-sm capitalize">
                      share
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/*description container*/}
            <div
              className={`relative ${expandVideoDescription ? 'h-fit' : 'h-16'} flex w-full flex-col p-4  overflow-hidden bg-neutral-100 dark:bg-neutral-800 rounded-lg `}
            >
              {/* text container */}
              <div className="h-full flex-wrap text-wrap space-y-4 ">
                <h2>{decodeHtmlEntities(selectedVideo?.snippet.channelDescription)}</h2>
                <p>{decodeHtmlEntities(selectedVideo?.snippet?.description)}</p>
              </div>
              {/*fading overlay*/}
              {!expandVideoDescription && (
                <div className="absolute inset-x-0  bottom-0   rounded-b-lg  h-12  bg-gradient-to-t from-white dark:from-darkTheme via-[rgba(255,255,255,0.5)] to-transparent pointer-events-none " />
              )}
              <button
                className="absolute right-0 bottom-0  font-thin hover:text-neutral-500  dark:text-neutral-300 dark:hover:text-neutral-400 z-10"
                onClick={handleExpandVideoDescription}
              >
                {expandVideoDescription ? 'show less' : '...more'}
              </button>
            </div>
            <div className="flex flex-row space-x-4 text-xl font-bold">
              <h1>{selectedVideo?.statistics?.commentCount}</h1>
              <h1>Comments</h1>
            </div>

            {/* comments section */}
            <div className=" h-full max-w-full ">
              <ul className=" flex flex-col  space-y-8 ">
                {comments.map((thread) => (
                  <li key={thread.id}>
                    {/* top level comment */}
                    <div className="flex flex-row space-x-4 ">
                      {/*Logo*/}
                      <div className="flex justify-start p-2  ">
                        <div className="flex flex-row space-x-2">
                          <img
                            src={thread.snippet.topLevelComment.snippet.authorProfileImageUrl}
                            alt=""
                            className=" min-h-12 min-w-12 h-12 w-12 flex justify-center items-center object-cover rounded-full"
                          />
                        </div>
                      </div>
                      <div className=" w-full flex flex-col  space-y-2  ">
                        {/* Author */}
                        <strong>{thread.snippet.topLevelComment.snippet.authorDisplayName}</strong>
                        {/* Message Content */}
                        <p className="w-full text-wrap">
                          {decodeHtmlEntities(thread.snippet.topLevelComment.snippet.textDisplay)}
                        </p>
                        <div className="flex flex-row justify-start space-x-4">
                          <div className="flex flex-row justify-start space-x-2">
                            <FontAwesomeIcon icon={faThumbsUp} size="lg" />
                            <p>
                              {thread.snippet.topLevelComment.snippet.likeCount > 0
                                ? thread.snippet.topLevelComment.snippet.likeCount
                                : null}
                            </p>
                          </div>
                          <div className="flex flex-row justify-start space-x-2 -scale-x-100">
                            <FontAwesomeIcon icon={faThumbsDown} size="lg" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {thread.snippet.totalReplyCount > 0 && (
                      <div className=" flex flex-col mx-20 mt-4 ">
                        <button
                          onClick={handleShowTopLevelReplies}
                          className=" flex flex-row min-h-12 h-12 min-w-24 w-32 justify-center items-center space-x-4 rounded-full dark:hover:bg-blue-900 hover:bg-blue-200"
                        >
                          <div className="min-w-fit flex flex-row space-x-2  justify-center items-center font-bold">
                            <FontAwesomeIcon icon={showTopLevelReplies ? faAngleUp : faAngleDown} />
                            <div className="flex flex-row space-x-2">
                              <p> {thread.snippet.totalReplyCount}</p>
                              <p>replies</p>
                            </div>
                          </div>
                        </button>
                        {/* replies */}
                        {showTopLevelReplies && (
                          <ul className="space-y-4 p-2 ">
                            {thread.replies?.comments.map((reply, index) => (
                              <li key={index} className="flex flex-row space-x-4">
                                <div className="flex justify-start p-2">
                                  <img
                                    src={reply.authorProfileImageUrl}
                                    className=" min-h-8 min-w-8 h-8 w-8 rounded-full"
                                    alt=""
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <strong>{reply.authorDisplayName}</strong>
                                  <p>{decodeHtmlEntities(reply.textDisplay)}</p>
                                  <div className="flex flex-row justify-start items-center space-x-4 ">
                                    <div className="flex flex-row justify-center items-center space-x-2 ">
                                      <FontAwesomeIcon icon={faThumbsUp} size="sm" />
                                      <p>{reply.likeCount > 0 ? reply.likeCount : null}</p>
                                    </div>
                                    <div className="flex flex-row justify-start space-x-2 -scale-x-100">
                                      <FontAwesomeIcon icon={faThumbsDown} size="sm" />
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {/* Spinning Circle*/}
            {commentsLoading && (
              <div className="flex w-full justify-center items-center ">
                {/* eslint-disable-next-line max-len */}
                <div className="min-h-9 min-w-9  h-9 w-9 border-2 rounded-full animate-spin  duration-75 dark:border-slate-300 dark:border-t-black border-grey  border-t-white" />
              </div>
            )}
          </div>
          <div className="hidden  min-h-fit h-fit lg:flex flex-col justify-start items-center  w-[600px] flex-shrink border border-amber-400">
            {firstLoadRelatedVideos.map((video) => (
              <div key={`${video.id.videoId}-${video.snippet.title}`} onClick={() => handleSelectedVideo(video)}>
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        </>
      </div>
      <div ref={pageScrollSentinelRef} className="flex h-4 w-full " />
    </div>
  );
};
