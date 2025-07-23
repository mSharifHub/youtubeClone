import React, { useRef, useState } from 'react';
import YouTube, { YouTubePlayer, YouTubeProps } from 'react-youtube';
import { useYoutubeComments } from '../hooks/useYoutubeComments.ts';
import useYoutubeRelatedVideos from '../hooks/useYoutubeRelatedVideos.ts';
import VideoCardPlayer from '../VideoComponents/VideoCardPlayer.tsx';
import { CommentsThreads } from '../VideoComponents/CommentsThreads.tsx';
import SpinningCircle from '../VideoComponents/SpinningCircle.tsx';
import { RelatedVideos } from '../VideoComponents/RelatedVideos.tsx';
import { useHandleSelectedVideo } from '../hooks/useHandleSelectedVideo.ts';
import { ShareModal } from '../VideoComponents/ShareModal.tsx';
import { UserMakeComment } from '../VideoComponents/UserMakeComment.tsx';
import CommentLoading from '../VideoComponents/CommentLoading.tsx';
import { useSearchParams } from 'react-router-dom';


export const VideoPlayer: React.FC = () => {
  const apiKey: string = import.meta.env.VITE_YOUTUBE_API_3;
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [expandVideoDescription, setExpandVideoDescription] = useState<boolean>(false);
  const [showTopLevelReplies, setShowTopLevelReplies] = useState<boolean>(false);

  const [liked, setLiked] = useState<boolean>(false); // refactor as context dispatch state
  const [dislike, setDislike] = useState<boolean>(false);
  const [animateLike, setAnimateLike] = useState<boolean>(false);
  const [subscribed, setSubscribed] = useState<boolean>(false); // refactor as context dispatch state
  const [animateRing, setAnimateRing] = useState<boolean>(false);

  const [openShareModal, setopenShareModal] = useState<boolean>(false);

  const [searchParams] = useSearchParams();

  const videoId = searchParams.get('v');

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

  const handleOpenShareModal = () => {
    setopenShareModal(true);
  };

  const handleCloseShareModal = () => {
    setopenShareModal(false);
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

  const filteredSelectedVideosList = relatedVideos.filter((video) => video.id.videoId !== videoId);

  const handleLike = () => {
    if (!liked) {
      setAnimateLike(false);
      setTimeout(() => {
        setAnimateLike(true);
        setDislike(false);
      }, 10);
    }
    setLiked((prev) => !prev);
    if (dislike) setDislike(false);
  };

  const handleDislike = () => {
    if (!dislike) {
      setTimeout(() => {
        setLiked(false);
      }, 10);
    }
    setDislike((prev) => !prev);
    if (liked) setLiked(false);
  };

  const handleSubscribe = () => {
    if (!subscribed) {
      setAnimateRing(false);
      setTimeout(() => {
        setAnimateRing(true);
      }, 10);
    }
    setSubscribed((prev) => !prev);
  };

  return (
    <div className="h-screen w-full overflow-y-scroll scroll-smooth  no-scrollbar flex flex-col">
      {/* share Modal*/}
      <ShareModal isOpenShareModal={openShareModal} onClose={handleCloseShareModal} />
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
            liked={liked}
            dislike={dislike}
            handleLike={handleLike}
            animateLike={animateLike}
            subscribed={subscribed}
            handleDislike={handleDislike}
            handleOpenShareModal={handleOpenShareModal}
            handleSubscribe={handleSubscribe}
            animateRing={animateRing}
          />
          {/* user comment section */}
          <UserMakeComment />
          {/* comments section */}
          <CommentsThreads comments={comments} handleShowTopLevelReplies={handleShowTopLevelReplies} showTopLevelReplies={showTopLevelReplies} commentsError={commentsError} />

          {/*/ sentinel observer */}
          <div ref={sentinelRef} className="h-2  w-full" />

          {/* SpinningCircle Circle*/}
          {commentsLoading && (
            <div className="flex flex-col p-4 gap-4 ">
              <ul>
                {Array.from({ length: 3 }).map((_, index) => (
                  <li key={index} className="flex flex-row space-x-4">
                    <CommentLoading />
                  </li>
                ))}
              </ul>

              <SpinningCircle />
            </div>
          )}
        </div>
        {/* column-2 */}
        <div className="hidden lg:flex flex-col w-[400px] flex-shrink-0">
          <RelatedVideos
            relatedVideos={filteredSelectedVideosList}
            relatedVideosLoading={relatedVideosLoading}
            handleSelectedVideo={handleSelectedVideo}
            relatedVideosError={relatedVideosError}
          />
        </div>
      </div>
    </div>
  );
};
