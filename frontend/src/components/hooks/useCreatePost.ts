import { gql } from '@apollo/client';
import { useCreatePostMutation } from '../../graphql/types.ts';

export const useCreatePost = () => {
  const [createPost, { loading, error, data }] = useCreatePostMutation({
    update(cache, { data }) {
      const newPost = data?.createPost?.post;
      if (!newPost) return;

      cache.modify({
        fields: {
          viewerPosts(existingConnections = {}) {
            const newPostRef = cache.writeFragment({
              id: cache.identify(newPost),
              fragment: gql`
                fragment NewPost on PostNode {
                  __typename
                  id
                  content
                  createdAt
                  profilePicture
                  author {
                    __typename
                    youtubeHandler
                  }
                  images {
                    __typename
                    image
                  }
                }
              `,
              data: newPost,
            });
            const newEdge = {
              __typename: 'PostNodeEdge',
              node: newPostRef,
            };
            return {
              ...existingConnections,
              edges: [newEdge, ...(existingConnections.edges ?? [])],
            };
          },
        },
      });
    },

    // onCompleted(data) {
    //   const newPost = data?.createPost;
    //   if (!newPost) return;
    //   dispatch({ type: 'SET_USER', payload: newPost });
    // },
  });

  return {
    createPost,
    loading,
    error,
    data,
  };
};
