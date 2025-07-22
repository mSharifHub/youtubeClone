import { useQuery } from '@apollo/client';
import { ViewerPostsQuery } from '../../graphql/types.ts';
import { VIEWER_POSTS_QUERY } from '../../graphql/queries/queries.ts';
import { useIntersectionObserver } from './useIntersectionObserver.ts';

export const useUserViewerPosts = (first: number = 10) => {
  const { data, loading, error, fetchMore } = useQuery<ViewerPostsQuery>(VIEWER_POSTS_QUERY, {
    variables: { first },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  const loadMore = async () => {
    if (loading) return;

    if (!data?.viewerPosts?.pageInfo || !data?.viewerPosts?.pageInfo.endCursor) return;

    await fetchMore({
      variables: {
        first,
        after: data?.viewerPosts?.pageInfo.endCursor,
      },
    });
  };

  const postsLen = data?.viewerPosts?.edges?.length ?? 0;

  const sentinelRef = useIntersectionObserver(loadMore, loading, postsLen);

  return {
    data,
    loading,
    error,
    sentinelRef,
  };
};
