import React, { useCallback, useEffect } from 'react';
import { useGoogleApi } from 'react-gapi';

/*Interface used to match with the user object
 */
export interface GoogleUserProfile {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
}

export const useGoogleAuthList = () => {
  // state to set the list of users
  const [usersAuthList, setUsersAuthList] = React.useState<GoogleUserProfile[]>(
    [],
  );
  // state to use with front end while is loading the user data
  const [loading, setLoading] = React.useState<boolean>(true);

  // debug for errors
  const [error, setError] = React.useState<Error | null>(null);

  const gapi = useGoogleApi({
    scopes: ['profile', ' email'],
  });

  const getUserGapi = useCallback(() => {
    try {
      const auth = gapi?.auth2.getAuthInstance();

      if (auth) {
        setLoading(false);

        if (auth.isSignedIn.get()) {
          const profile = {
            id: auth.currentUser.get().getBasicProfile().getId(),
            name: auth.currentUser.get().getBasicProfile().getName(),
            email: auth.currentUser.get().getBasicProfile().getEmail(),
            imageUrl: auth.currentUser.get().getBasicProfile()?.getImageUrl(),
          };

          setUsersAuthList((prev) => {
            const existentUser = prev.some((user) => user.id === profile.id);

            if (!existentUser) {
              return [...prev, profile];
            }

            return prev;
          });
        }
      }
    } catch (error) {
      setError(error as Error);
    }
  }, [gapi]);

  useEffect(() => {
    getUserGapi();
  }, [getUserGapi]);

  return { usersAuthList, loading, error };
};
