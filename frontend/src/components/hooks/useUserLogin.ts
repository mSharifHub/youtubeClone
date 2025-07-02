import { useSearchParams } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { ViewerQuery } from '../../graphql/types.ts';
import { VIEWER_QUERY } from '../../graphql/queries/queries.ts';
import { useUser } from '../../contexts/userContext/UserContext.tsx';

export const useUserLogin = () => {
  const [searchParams] = useSearchParams();

  const { dispatch } = useUser();

  const [fetchUser] = useLazyQuery<ViewerQuery>(VIEWER_QUERY, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data && data.viewer) {
        dispatch({ type: 'SET_USER', payload: data.viewer });
      }
    },
    onError: () => {
      dispatch({ type: 'CLEAR_USER' });
    },
  });

  const handleFetchUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  const redirectGoogleAuth = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_RESOURCE_SERVER;
  };

  useEffect(() => {
    const success = searchParams.get('success');

    if (success === 'true') {
      handleFetchUser();
      window.history.replaceState({}, document.title, '/');
    }
  }, [searchParams, handleFetchUser]);


  return { redirectGoogleAuth };
};
