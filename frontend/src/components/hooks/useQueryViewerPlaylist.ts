import { useViewerVideoPlayListQuery } from '../../graphql/types.ts';
import { useIntersectionObserver } from './useIntersectionObserver.ts';

export const useQueryViewerPlaylist = (first: number = 10) => {
  const { data, loading, error, fetchMore } = useViewerVideoPlayListQuery({
    variables: { first },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  const loadMore = async () => {
    if (!loading) return;

    if (!data?.viewerVideoPlaylist?.videoEntries?.pageInfo || !data?.viewerVideoPlaylist?.videoEntries?.pageInfo.endCursor) return;

    await fetchMore({
      variables: {
        first,
        after: data?.viewerVideoPlaylist?.videoEntries?.pageInfo.endCursor,
      },
    });
  };
  const viewerPlaylistLength = data?.viewerVideoPlaylist?.videoEntries?.edges?.length ?? 0;
  const sentinelRef = useIntersectionObserver(loadMore, loading, viewerPlaylistLength);

  return {
    data,
    loading,
    error,
    sentinelRef,
    loadMore,
  };
};
