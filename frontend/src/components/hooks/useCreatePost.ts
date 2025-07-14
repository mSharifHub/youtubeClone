import { PostNodeEdge, useCreatePostMutation, ViewerPostsQuery } from '../../graphql/types.ts';
import { VIEWER_POSTS_QUERY } from '../../graphql/queries/queries.ts';

export const useCreatePost = () => {
  const [createPost, { loading, error, data }] = useCreatePostMutation({
    update(cache, { data }) {
      const payLoad = data?.createPost;

      if (!payLoad?.post || payLoad?.cursor) return;

      const existing = cache.readQuery<ViewerPostsQuery>({
        query: VIEWER_POSTS_QUERY,
        variables: { first: 10 },
      });

      if (!existing?.viewerPosts) return;

      const newEdge = {
        cursor: payLoad.cursor,
        node: {
          ...payLoad.post,
        },
      };

      cache.writeQuery<ViewerPostsQuery>({
        query: VIEWER_POSTS_QUERY,
        variables: { first: 10 },
        data: {
          viewerPosts: {
            ...existing.viewerPosts,
            edges: [newEdge as PostNodeEdge, ...existing.viewerPosts.edges],
          },
        },
      });
    },
  });

  return {
    createPost,
    loading,
    data,
    error,
  };
};
