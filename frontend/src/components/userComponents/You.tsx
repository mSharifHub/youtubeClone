import { UserProfileCard } from './UserProfileCard.tsx';
import { useVideoGrid } from '../hooks/useVideosGrid.ts';
import { videosPerRowDisplayValues } from '../../helpers/homeVideoDisplayOptions.ts';
import { useHandleSelectedVideo } from '../hooks/useHandleSelectedVideo.ts';
import { useViewerVideoPlayListQuery, VideoPlaylistEntryNode } from '../../graphql/types.ts';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.ts';
import SpinningCircle from '../VideoComponents/SpinningCircle.tsx';
import { NavigationControls } from '../playlistComponents/NavigationControls.tsx';
import { useNavigationControlsOptions } from '../hooks/useNavigationControlsOptions.ts';
import { PlayListContainer } from '../playlistComponents/playListContainer.tsx';

export const You = () => {
  const { data, loading, fetchMore } = useViewerVideoPlayListQuery({
    variables: { first: 10 },
    nextFetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const videosPerRow = useVideoGrid(videosPerRowDisplayValues);

  const playlist = (data?.viewerVideoPlaylist?.videoEntries?.edges ?? []).filter((edge): edge is { node: VideoPlaylistEntryNode } => !!edge?.node && !!edge.node.video);

  const HandleSelectedVideo = useHandleSelectedVideo();

  const handleLoadMorePlaylistHist = async () => {
    if (loading) return;

    if (!data?.viewerVideoPlaylist?.videoEntries?.pageInfo || !data?.viewerVideoPlaylist?.videoEntries.pageInfo.endCursor) return;

    await fetchMore({
      variables: {
        first: 10,
        after: data?.viewerVideoPlaylist?.videoEntries?.pageInfo?.endCursor,
      },
    });
  };

  const sentinelRefHist = useIntersectionObserver(handleLoadMorePlaylistHist, loading, playlist.length);

  const historyControls = useNavigationControlsOptions({ videosPerRow, playlistLength: playlist.length });

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
          playListLength={playlist.length}
          playlist={playlist}
          HandleSelectedVideo={HandleSelectedVideo}
        />

        {loading && <SpinningCircle />}
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
      </div>
    </div>
  );
};
