import { gql } from '@apollo/client';
import { useCreatePostMutation } from '../../graphql/types.ts';

import { useUser } from '../../contexts/userContext/UserContext.tsx';

export const useCreatePost = () => {
  const { dispatch } = useUser();

  const [createPost, { loading, error, data }] = useCreatePostMutation({
    update(cache, { data }) {
      const newPost = data?.createPost;
      if (!newPost) return;

      cache.modify({
        fields: {
          viewerPosts(existingPosts = []) {
            const newPostRef = cache.writeFragment({
              data: newPost,
              fragment: gql`
                fragment NewPost on PostType {
                  id
                  content
                  createdAt
                  author {
                    youtubeHandler
                  }
                  images {
                    image
                  }
                  profilePicture
                }
              `,
            });
            return [...existingPosts, newPostRef];
          },
        },
      });
    },
    onCompleted(data) {
      const newPost = data?.createPost;
      if (!newPost) return;
      dispatch({ type: 'CREATE_POST', payload: newPost });
    },
  });

  return {
    createPost,
    loading,
    error,
    data,
  };
};
