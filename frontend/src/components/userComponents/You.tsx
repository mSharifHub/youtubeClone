import { UserProfileCard } from './UserProfileCard.tsx';
import { useVideoGrid } from '../hooks/useVideosGrid.ts';
import { videosPerRowDisplayValues } from '../../helpers/homeVideoDisplayOptions.ts';
import { useHandleSelectedVideo } from '../hooks/useHandleSelectedVideo.ts';
import { useViewerVideoPlayListQuery, useYoutubeLikedVideosQuery, VideoNode } from '../../graphql/types.ts';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.ts';
import SpinningCircle from '../VideoComponents/SpinningCircle.tsx';
import { NavigationControls } from '../playlistComponents/NavigationControls.tsx';
import { useNavigationControlsOptions } from '../hooks/useNavigationControlsOptions.ts';
import { PlayListContainer } from '../playlistComponents/playListContainer.tsx';

export const You = () => {
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

    await fetchMorePlaylistHist({
      variables: {
        first: 10,
        after: playlistHistData?.viewerVideoPlaylist?.videoEntries?.pageInfo?.endCursor,
      },
    });
  };

  const handleLoadMoreLikedVideos = async () => {
    if (likedVideosLoading) return;

    const nextPage = likedVideosData?.youtubeLikedVideos?.nextPageToken;

    if (!nextPage) return;

    await fetchMoreLikedVideos({
      variables: {
        maxResults: 10,
        pageToken: nextPage,
      },
    });
  };

  const sentinelRefHist = useIntersectionObserver(handleLoadMorePlaylistHist, playlistHistLoading, playListVideos.length);

  const sentinelRefLiked = useIntersectionObserver(handleLoadMoreLikedVideos, likedVideosLoading, likedVideosData?.youtubeLikedVideos?.videos?.length ?? 0, 20);

  const historyControls = useNavigationControlsOptions({ videosPerRow, playlistLength: playListVideos.length });

  const likeControls = useNavigationControlsOptions({ videosPerRow, playlistLength: 10 });

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

        {playlistHistLoading && <SpinningCircle />}
        {historyControls.viewAll && <div ref={sentinelRefHist} />}
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
        {likedVideosLoading && <SpinningCircle />}
        {likeControls.viewAll && <div ref={sentinelRefLiked} />}
      </div>
    </div>
  );
};
