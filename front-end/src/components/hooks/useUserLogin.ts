import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useFetchUser } from './useFetchUser.ts';

export const useUserLogin = () => {
  const [searchParams] = useSearchParams();

  const fetchUser = useFetchUser();

  const handleFetchUser = async () => {
    await fetchUser();
  };

  const redirectGoogleAuth = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_RESOURCE_SERVER;
  };

  useEffect(() => {
    const success = searchParams.get('success');

    if (success === 'true') {
      window.history.replaceState({}, document.title, '/');
      handleFetchUser();
    }
  }, [searchParams]);

  return { redirectGoogleAuth };
};
