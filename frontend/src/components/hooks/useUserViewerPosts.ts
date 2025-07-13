import { useQuery } from '@apollo/client';
import { ViewerPostsQuery } from '../../graphql/types.ts';
import { VIEWER_POSTS_QUERY } from '../../graphql/queries/queries.ts';
import { useIntersectionObserver } from './useIntersectionObserver.ts';

export const useUserViewerPosts = (first: number = 10, orderBy?: string) => {
  const { data, loading, error, fetchMore } = useQuery<ViewerPostsQuery>(VIEWER_POSTS_QUERY, {
    variables: { first, orderBy },
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
        orderBy,
      },
    });
  };

  return {
    data,
    loading,
    error,
    loadMore,
  };
};
