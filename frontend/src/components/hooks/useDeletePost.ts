import { PostNodeEdge, useDeletePostMutation } from '../../graphql/types.ts';

export const useDeletePost = () => {
  const [deletePost, { data, loading, error }] = useDeletePostMutation({
    update(cache, { data }) {
      const postId = data?.deletePost?.post?.id

      if (!postId) return;

      const cacheId = cache.identify({ __typename: 'PostNode', id: postId });


      if (cacheId) cache.evict({ id: cacheId });

      cache.modify({
        fields: {
          viewerPosts(existingConnections = {}, { readField }) {
            const newEdges = existingConnections.edges?.filter((edge: PostNodeEdge) => {
              if (edge.node) {
                const nodeId = readField('id', edge.node);
                return nodeId !== postId;
              }
            });

            return {
              ...existingConnections,
              edges: newEdges,
            };
          },
        },
      });
      cache.gc();
      // to remove ref on cache to prevent dangling ref
    },
  });

  return {
    deletePost,
    data,
    loading,
    error,
  };
};
