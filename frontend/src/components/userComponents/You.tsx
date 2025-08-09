import { UserProfileCard } from './UserProfileCard.tsx';
import { useVideoGrid } from '../hooks/useVideosGrid.ts';
import { videosPerRowDisplayValues } from '../../helpers/homeVideoDisplayOptions.ts';
import { useHandleSelectedVideo } from '../hooks/useHandleSelectedVideo.ts';
import { useViewerVideoPlayListQuery, useYoutubeLikedVideosQuery, VideoNode } from '../../graphql/types.ts';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.ts';
import { NavigationControls } from '../playlistComponents/NavigationControls.tsx';
import { useNavigationControlsOptions } from '../hooks/useNavigationControlsOptions.ts';
import { PlayListContainer } from '../playlistComponents/playListContainer.tsx';
import { useState } from 'react';
import SpinningCircle from '../VideoComponents/SpinningCircle.tsx';

export const You = () => {
  const [isFtchMoreLike, setIsFtchMoreLike] = useState<boolean>(false);
  const [isFtchMoreHist, setIsFtchMoreHist] = useState<boolean>(false);
  const {
    data: playlistHistData,
    loading: playlistHistLoading,
    fetchMore: fetchMorePlaylistHist,
  } = useViewerVideoPlayListQuery({
    variables: { first: 10 },
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: likedVideosData,
    loading: likedVideosLoading,
    fetchMore: fetchMoreLikedVideos,
  } = useYoutubeLikedVideosQuery({
    variables: {
      maxResults: 10,
    },
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  });

  const videosPerRow = useVideoGrid(videosPerRowDisplayValues);

  const playListVideos = (playlistHistData?.viewerVideoPlaylist?.videoEntries?.edges ?? [])
    .map((edge) => ({
      video: edge?.node?.video,
      watchedAt: edge?.node?.watchedAt,
    }))
    .filter((item): item is { video: VideoNode; watchedAt: string } => item.video !== null);

  const likedVideos: VideoNode[] = (likedVideosData?.youtubeLikedVideos?.videos ?? []).filter((video): video is VideoNode => video !== null);

  const HandleSelectedVideo = useHandleSelectedVideo();

  const handleLoadMorePlaylistHist = async () => {
    if (playlistHistLoading) return;

    if (!playlistHistData?.viewerVideoPlaylist?.videoEntries?.pageInfo || !playlistHistData?.viewerVideoPlaylist?.videoEntries.pageInfo.endCursor) return;

    setIsFtchMoreHist(true);
    try {
      await fetchMorePlaylistHist({
        variables: {
          first: 10,
          after: playlistHistData?.viewerVideoPlaylist?.videoEntries?.pageInfo?.endCursor,
        },
      });
    } finally {
      setIsFtchMoreHist(false);
    }
  };

  const handleLoadMoreLikedVideos = async () => {
    if (likedVideosLoading) return;

    const nextPage = likedVideosData?.youtubeLikedVideos?.nextPageToken;

    if (!nextPage) return;

    setIsFtchMoreLike(true);

    try {
      await fetchMoreLikedVideos({
        variables: {
          maxResults: 1,
          pageToken: nextPage,
        },
      });
    } finally {
      setIsFtchMoreLike(false);
    }
  };

  const sentinelRefHist = useIntersectionObserver(handleLoadMorePlaylistHist, playlistHistLoading, playListVideos.length);

  const sentinelRefLiked = useIntersectionObserver(handleLoadMoreLikedVideos, likedVideosLoading, likedVideosData?.youtubeLikedVideos?.videos?.length ?? 0, 20);

  const historyControls = useNavigationControlsOptions({ videosPerRow, playlistLength: playListVideos.length });

  const likeControls = useNavigationControlsOptions({ videosPerRow, playlistLength: likedVideos.length });

  return (
    <div className="h-full w-full flex flex-col overflow-y-scroll scroll-smooth  p-8 gap-8  ">
      <UserProfileCard />
      <div className="w-full flex flex-col gap-2 p-2">
        <h1 className="text-2xl font-medium ">History</h1>
        <NavigationControls
          viewAll={historyControls.viewAll}
          currentIndex={historyControls.currentIndex}
          onViewAllToggle={historyControls.handleViewAll}
          onScrollLeft={historyControls.handleScrollDown}
          onScrollRight={historyControls.handleScrollUp}
          viewAllText={{
            expanded: 'view less',
            collapsed: 'view all',
          }}
        />

        <PlayListContainer
          ref={historyControls.scrollRef}
          viewAll={historyControls.viewAll}
          videosPerRow={videosPerRow}
          playListLength={playListVideos.length}
          playlist={playListVideos}
          HandleSelectedVideo={HandleSelectedVideo}
        />
        {historyControls.viewAll && <div ref={sentinelRefHist} />}
        {isFtchMoreHist && <SpinningCircle />}
      </div>

      <div className="w-full flex flex-col gap-2 p-2">
        <h1 className="text-2xl font-medium">Liked</h1>
        <NavigationControls
          viewAll={likeControls.viewAll}
          currentIndex={likeControls.currentIndex}
          onViewAllToggle={likeControls.handleViewAll}
          onScrollLeft={likeControls.handleScrollDown}
          onScrollRight={likeControls.handleScrollUp}
          viewAllText={{
            expanded: 'view less',
            collapsed: 'view all',
          }}
        />

        <PlayListContainer
          ref={likeControls.scrollRef}
          viewAll={likeControls.viewAll}
          videosPerRow={videosPerRow}
          playListLength={likedVideos?.length ?? 0}
          playlist={likedVideos}
          HandleSelectedVideo={HandleSelectedVideo}
        />
        {likeControls.viewAll && <div ref={sentinelRefLiked} />}
        {isFtchMoreLike && <SpinningCircle />}
      </div>
    </div>
  );
};
