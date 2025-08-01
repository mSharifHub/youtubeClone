
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface GoogleUserProfile {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
}

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
