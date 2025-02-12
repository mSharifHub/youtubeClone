import { GoogleUserProfile } from './useListAccounts.ts';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useSwitchAccounts = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');

    if (success === 'true') {
      window.history.replaceState({}, document.title, '/');
    }
  }, [searchParams]);

  return (account: GoogleUserProfile) => {
    let googleLoginUrl = import.meta.env.VITE_GOOGLE_RESOURCE_SERVER;

    if (account) {
      googleLoginUrl += `?login_hint=${encodeURIComponent(account.email)}`;
    }

    window.location.href = googleLoginUrl;
  };
};
