import React, { useRef, useState } from 'react';
import YouTube, { YouTubePlayer, YouTubeProps } from 'react-youtube';
import { useSelectedVideo } from '../../contexts/selectedVideoContext/SelectedVideoContext.ts';
import useYoutubeVideos from '../hooks/useYoutubeVideos.ts';
import { VideoCard } from '../VideoComponents/VideoCard.tsx';
import { VideoCardLoading } from '../VideoComponents/VideoCardLoading.tsx';
import { useYoutubeComments } from '../hooks/useYoutubeComments.ts';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.ts';
import useYoutubeRelatedVideos from '../hooks/useYoutubeRelatedVideos.ts';
import VideoCardPlayer from '../VideoComponents/VideoCardPlayer.tsx';
import { CommentsThreads } from '../VideoComponents/CommentsThreads.tsx';
import SpinningCircle from '../VideoComponents/SpinningCircle.tsx';

export const VideoPlayer: React.FC = () => {
  const { selectedVideo } = useSelectedVideo();

  const playerRef = useRef<YouTubePlayer | null>(null);

  const [expandVideoDescription, setExpandVideoDescription] = useState<boolean>(false);
  const [showTopLevelReplies, setShowTopLevelReplies] = useState<boolean>(false);

  const apiKey: string = import.meta.env.VITE_YOUTUBE_API_3;

  const opts: YouTubeProps['opts'] = {
    playerVars: {
      autoplay: 1,
      controls: 1,
      fs: 1,
      rel: 0,
      modestbranding: 1,
    },
  };

  const handleExpandVideoDescription = (): void => {
    setExpandVideoDescription((prev) => !prev);
  };

  const handleShowTopLevelReplies = (): void => {
    setShowTopLevelReplies((prev) => !prev);
  };

  const onReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
  };

  const YoutubeComponent = YouTube as YouTubeProps as React.FC<YouTubeProps>;

  const { handleSelectedVideo } = useYoutubeVideos(apiKey);

  const { comments, commentsLoading, commentsPageToken, topLevelCount, fetchComments, commentsError } = useYoutubeComments(apiKey, 10);

  const loadMoreComments = async () => {
    if (!commentsPageToken || !selectedVideo) return;
    await fetchComments(selectedVideo.id.videoId, commentsPageToken);
  };

  const sentinelRef = useIntersectionObserver(loadMoreComments, commentsLoading, topLevelCount);

  const { relatedVideos, relatedVideosLoading, relatedVideosError } = useYoutubeRelatedVideos(apiKey);

  return (
    <div className="h-screen flex flex-col overflow-y-scroll scroll-smooth">
      <div className="flex justify-around items-start  p-2 space-x-14 ">
        {/* column-1*/}
        <div className="min-h-fit h-fit w-full flex flex-col justify-start items-start space-y-8 ">
          {/* video Player and video information */}
          <VideoCardPlayer YoutubeComponent={YoutubeComponent} opts={opts} onReady={onReady} />

          {/* comments section */}
          <CommentsThreads comments={comments} handleShowTopLevelReplies={handleShowTopLevelReplies} showTopLevelReplies={showTopLevelReplies} />

          {/* sentinel observer*/}
          {/*<div className="h-4 w-full bg-amber-300" ref={sentinelRef} />*/}

          {/* SpinningCircle Circle*/}
          {commentsLoading && <SpinningCircle />}
        </div>

        {/* column-2 */}
        <div className="hidden   min-h-fit  lg:flex flex-col justify-start items-center  w-[600px] flex-initial">
          {relatedVideosLoading ? (
            <div className="w-full space-y-10">
              {Array.from({
                length: 10,
              }).map((_, index) => (
                <VideoCardLoading key={`loading-${index}`} />
              ))}
            </div>
          ) : (
            relatedVideos.map((video) => (
              <div key={`${video.id.videoId}-${video.snippet.title}`} onClick={() => handleSelectedVideo(video)}>
                <VideoCard video={video} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
