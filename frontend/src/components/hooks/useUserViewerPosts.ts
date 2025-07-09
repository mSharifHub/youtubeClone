import { useQuery } from '@apollo/client';
import { ViewerPostsQuery, ViewerPostsQueryResult, ViewerPostsQueryVariables } from '../../graphql/types.ts';
import { VIEWER_POSTS_QUERY } from '../../graphql/queries/queries.ts';

export const useUserViewerPosts = (): ViewerPostsQueryResult => {
  return useQuery<ViewerPostsQuery, ViewerPostsQueryVariables>(VIEWER_POSTS_QUERY, {
    fetchPolicy: 'cache-first',
  });
};
