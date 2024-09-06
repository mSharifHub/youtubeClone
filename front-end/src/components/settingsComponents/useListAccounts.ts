import { gapi } from 'gapi-script';
import React, { useEffect } from 'react';

interface GoogleUserProfile {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
}

export const useGoogleAuthList = () => {
  const [usersAuthList, setUsersAuthListList] = React.useState<
    GoogleUserProfile[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error | null>(null);

  useEffect(() => {
    const initGapi = () => {
      gapi.load('auth2', () => {
        gapi.auth2
          .init({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            fetch_basic_profile: true,
            scope: 'profile email',
          })
          .then((auth2) => {
            setLoading(false);
            if (auth2.isSignedIn.get()) {
              const currentUser = auth2.currentUser.get();

              if (currentUser.isSignedIn()) {
                const basicProfile = currentUser.getBasicProfile();
                const userProfile = {
                  id: basicProfile.getId(),
                  email: basicProfile.getEmail(),
                  name: basicProfile.getName(),
                  imageUrl: basicProfile.getImageUrl(),
                };

                setUsersAuthListList((prevProfile) => {
                  const userExist = prevProfile.some(
                    (user) => user.email === userProfile.email,
                  );

                  if (!userExist) {
                    return [...prevProfile, userProfile];
                  }

                  return prevProfile;
                });
              }
            }

            auth2.currentUser.listen((user) => {
              if (user.isSignedIn()) {
                const basicProfile = user.getBasicProfile();
                const userProfile = {
                  id: basicProfile.getId(),
                  email: basicProfile.getEmail(),
                  name: basicProfile.getName(),
                  imageUrl: basicProfile.getImageUrl(),
                };

                setUsersAuthListList((prevProfile) => {
                  const userExist = prevProfile.some(
                    (user) => user.email === userProfile.email,
                  );

                  if (!userExist) {
                    return [...prevProfile, userProfile];
                  }

                  return prevProfile;
                });
              } else {
                const signedOutUserEmail = user.getBasicProfile().getEmail();
                setUsersAuthListList((prevAuth) =>
                  prevAuth.filter((user) => user.email !== signedOutUserEmail),
                );
              }
            });
          })
          .catch((err) => {
            setError(err);
          });
      });
    };

    initGapi();
  }, []);

  return { usersAuthList, loading, error };
};
