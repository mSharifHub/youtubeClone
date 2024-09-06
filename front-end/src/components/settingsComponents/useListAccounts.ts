import { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';

const useGoogleAuthList = (clientId) => {

  const [isInitialized, setIsInitialized] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeGapi = () => {
      gapi.load('auth2', () => {
        gapi.auth2
          .init({
            clientId: clientId,
            scope: 'profile email',
          })
          .then(() => {
            setIsInitialized(true);
            checkLoggedInUsers();
          })
          .catch((error) => {
            console.error('Error initializing GAPI', error);
            setError(error);
          });
      });
    };

    if (clientId) {
      initializeGapi();
    }
  }, [clientId]);

  const checkLoggedInUsers = async () => {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      const user = authInstance.currentUser.get();
      if (user && user.isSignedIn()) {
        const basicProfile = user.getBasicProfile();

        const userProfile = {
          id: basicProfile.getId(),
          fullName: basicProfile.getName(),
          givenName: basicProfile.getGivenName(),
          familyName: basicProfile.getFamilyName(),
          imageUrl: basicProfile.getImageUrl(),
          email: basicProfile.getEmail(),
        };

        setAccounts((prevAccounts) => {
          const emailExist = prevAccounts.find(
            (account) => account.email === userProfile.email,
          );

          if (!emailExist) {
            return [...prevAccounts, userProfile];
          }

          return prevAccounts;
        });
      }
    } catch (err) {
      console.error('Error checking logged-in users', err);
      setError(err);
    }
  };

  return {
    accounts,
    error,
    isInitialized,
  };
};

export default useGoogleAuthList;
