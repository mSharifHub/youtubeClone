import { useEditPostMutation } from '../../graphql/types.ts';

export const useEditPost = () => {
  const [editPost, { loading, error, data }] = useEditPostMutation();
  return {
    editPost,
    data,
    loading,
    error,
  };
};
