import React, { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubePlayer, YouTubeProps } from 'react-youtube';
import VideoCardPlayer from '../VideoComponents/VideoCardPlayer.tsx';
import { ShareModal } from '../VideoComponents/ShareModal.tsx';
import { UserMakeComment } from '../VideoComponents/UserMakeComment.tsx';
import { CommentsThreads } from '../VideoComponents/CommentsThreads.tsx';
import SpinningCircle from '../VideoComponents/SpinningCircle.tsx';
import { CommentThreadNode, useVideoCommentsQuery, useYoutubeVideoCategoriesQuery, VideoNode } from '../../graphql/types.ts';
import { useSearchParams } from 'react-router-dom';
import { useSelectedVideo } from '../../contexts/selectedVideoContext/SelectedVideoContext.ts';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.ts';
import { useHandleSelectedVideo } from '../hooks/useHandleSelectedVideo.ts';
import { RelatedVideos } from '../VideoComponents/RelatedVideos.tsx';

export const VideoPlayer: React.FC = () => {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [expandVideoDescription, setExpandVideoDescription] = useState<boolean>(false);
  const [showTopLevelReplies, setShowTopLevelReplies] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false); // refactor as context dispatch state
  const [dislike, setDislike] = useState<boolean>(false);
  const [animateLike, setAnimateLike] = useState<boolean>(false);
  const [subscribed, setSubscribed] = useState<boolean>(false); // refactor as context dispatch state
  const [animateRing, setAnimateRing] = useState<boolean>(false);
  const [openShareModal, setopenShareModal] = useState<boolean>(false);
  const { selectedVideo } = useSelectedVideo();

  const [searchParams] = useSearchParams();

  const videoId = searchParams.get('v');

  const MESSAGE_THREADS_FETCH_LIMIT = 50;

  const {
    data: commentsData,
    loading,
    fetchMore,
    error,
  } = useVideoCommentsQuery({
    variables: {
      videoId: selectedVideo?.videoId ?? videoId!,
      maxResults: 10,
    },
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    skip: !selectedVideo,
  });

  const { data: relData, loading: relLoading } = useYoutubeVideoCategoriesQuery({
    variables: {
      categoryId: selectedVideo?.categoryId ?? '',
      maxResults: 10,
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    skip: !selectedVideo,
  });

  const commentsThreads = (commentsData?.youtubeVideoComments?.commentsThreads ?? []).filter((thread): thread is CommentThreadNode => thread !== null);

  const relatedVideos = (relData?.youtubeVideoCategories?.videos ?? []).filter((video): video is VideoNode => video !== null);

  const seenVideosIds = new Set<string>();

  const filteredRelatedVideos = relatedVideos.reduce((acc, video) => {
    if (video.videoId !== selectedVideo?.videoId && !seenVideosIds.has(video.videoId)) {
      seenVideosIds.add(video.videoId);
      acc.push(video);
    }
    return acc;
  }, [] as VideoNode[]);



  const hasMore = commentsData?.youtubeVideoComments?.hasNextPage && commentsData?.youtubeVideoComments?.nextPageToken;

  const handleFetchMoreComments = async () => {
    if (loading) return;

    if (!hasMore) return;

    await fetchMore({
      variables: {
        videoId: selectedVideo?.videoId ?? videoId!,
        maxResults: 10,
        pageToken: commentsData?.youtubeVideoComments?.nextPageToken,
      },
    });
  };

  const sentinelRef = useIntersectionObserver(handleFetchMoreComments, loading, commentsThreads.length, MESSAGE_THREADS_FETCH_LIMIT);

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

  const handleSelectedVideo = useHandleSelectedVideo();

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

  useEffect(() => {
    if (relData) {
      console.log(relData);
    }
  }, [relData]);

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
          {/*comments section */}
          <CommentsThreads
            commentsThreads={commentsThreads}
            handleShowTopLevelReplies={handleShowTopLevelReplies}
            showTopLevelReplies={showTopLevelReplies}
            commentsError={error?.message ?? null}
          />
          {/*/ sentinel observer*/}
          <div ref={sentinelRef} className="h-2  w-full" />
          {loading && hasMore && <SpinningCircle style={'min-h-16 min-w-16  h-16 w-16 border-2 '} />}
        </div>
        {/* column-2 */}
        <div className="hidden lg:flex flex-col w-[400px] flex-shrink-0">
          <RelatedVideos relatedVideos={filteredRelatedVideos} relatedVideosLoading={relLoading} handleSelectedVideo={handleSelectedVideo} />
        </div>
      </div>
    </div>
  );
};
