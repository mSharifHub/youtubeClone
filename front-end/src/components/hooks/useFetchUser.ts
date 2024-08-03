import { useLazyQuery } from '@apollo/client';
import { ViewerQuery } from '../../graphql/types.ts';
import { VIEWER_QUERY } from '../../graphql/queries/queries.ts';
import { useUser } from '../../userContext/UserContext.tsx';

export const useFetchUser = () => {
  const { dispatch } = useUser();

  const [fetchUser] = useLazyQuery<ViewerQuery>(VIEWER_QUERY, {
    onCompleted: (data) => {
      if (data && data.viewer) {
        dispatch({ type: 'SET_USER', payload: data.viewer });
      }
    },

    onError: (error) => {
      console.log(error);
    },
  });

  return fetchUser;
};
