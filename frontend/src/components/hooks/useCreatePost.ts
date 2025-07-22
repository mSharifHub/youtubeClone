import { PostNodeEdge, useCreatePostMutation } from '../../graphql/types.ts';

export const useCreatePost = () => {
  const [createPost, { loading, error, data }] = useCreatePostMutation({
    update(cache, { data }) {
      const payload = data?.createPost;
      if (!payload?.post) return;

      cache.modify({
        fields: {
          viewerPosts(existing = { edges: [] }) {
            const newEdge = {
              __typename: 'PostNodeEdge',
              cursor: payload.cursor,
              node: {
                ...payload.post,
                __typename: 'PostNode',
              },
            };

            return {
              ...existing,
              edges: [newEdge as PostNodeEdge, ...existing.edges],
            };
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
