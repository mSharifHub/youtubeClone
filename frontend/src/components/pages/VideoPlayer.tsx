import React, { useRef, useState } from 'react';
import YouTube, { YouTubePlayer, YouTubeProps } from 'react-youtube';
import { useYoutubeComments } from '../hooks/useYoutubeComments.ts';
import useYoutubeRelatedVideos from '../hooks/useYoutubeRelatedVideos.ts';
import VideoCardPlayer from '../VideoComponents/VideoCardPlayer.tsx';
import { CommentsThreads } from '../VideoComponents/CommentsThreads.tsx';
import SpinningCircle from '../VideoComponents/SpinningCircle.tsx';
import { RelatedVideos } from '../VideoComponents/RelatedVideos.tsx';
import { useHandleSelectedVideo } from '../hooks/useHandleSelectedVideo.ts';

export const VideoPlayer: React.FC = () => {
  const apiKey: string = import.meta.env.VITE_YOUTUBE_API_3;
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [expandVideoDescription, setExpandVideoDescription] = useState<boolean>(false);
  const [showTopLevelReplies, setShowTopLevelReplies] = useState<boolean>(false);

  const opts: YouTubeProps['opts'] = {
    playerVars: {
      autoplay: 1,
      controls: 1,
      fs: 1,
      rel: 0,
      modestbranding: 1,
      origin: window.location.origin, // must check during deployment
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

  const handleSelectedVideo = useHandleSelectedVideo();

  const { comments, commentsLoading, commentsError, sentinelRef } = useYoutubeComments(apiKey, 10);

  const { relatedVideos, relatedVideosLoading, relatedVideosError } = useYoutubeRelatedVideos(apiKey);

  return (
    <div className="h-screen w-full overflow-y-scroll scroll-smooth  no-scrollbar flex flex-col">
      {/* Main Row: player/comments + related */}
      <div className="w-full flex flex-row  gap-10  p-4">
        {/* column-1*/}
        <div className="w-full flex-1  gap-4 ">
          {/* video Player and video information*/}
          <VideoCardPlayer
            YoutubeComponent={YouTube}
            opts={opts}
            onReady={onReady}
            handleExpandVideoDescription={handleExpandVideoDescription}
            expandVideoDescription={expandVideoDescription}
          />
          {/* comments section */}
          <CommentsThreads comments={comments} handleShowTopLevelReplies={handleShowTopLevelReplies} showTopLevelReplies={showTopLevelReplies} commentsError={commentsError} />

          {/*/ sentinel observer */}
          <div ref={sentinelRef} className="h-2  w-full" />

          {/* SpinningCircle Circle*/}
          {commentsLoading && <SpinningCircle />}
        </div>
        {/* column-2 */}
        <div className="hidden lg:flex flex-col w-[400px] flex-shrink-0">
          <RelatedVideos
            relatedVideos={relatedVideos}
            relatedVideosLoading={relatedVideosLoading}
            handleSelectedVideo={handleSelectedVideo}
            relatedVideosError={relatedVideosError}
          />
        </div>
      </div>
    </div>
  );
};
