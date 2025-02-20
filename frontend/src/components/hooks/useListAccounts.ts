import { gapi } from 'gapi-script';
import React, { useEffect } from 'react';

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
  const [usersAuthList, setUsersAuthList] = React.useState<GoogleUserProfile[]>([]);
  // state to use with front end while is loading the user data
  const [loading, setLoading] = React.useState<boolean>(true);

  // debug for errors
  const [error, setError] = React.useState<Error | null>(null);

  // to handle the list and filter prev logged profiles
  const onUpdateUserList = (userProfile: GoogleUserProfile) => {
    setUsersAuthList((prevList) => {
      const userExist = prevList.some((user) => user.email === userProfile.email);

      // If user does not exist then update the list
      if (!userExist) {
        return [...prevList, userProfile];
      }
      // otherwise return the previous profile list
      return prevList;
    });
  };

  useEffect(() => {
    // Initialize gapi according to documentation
    const initGapi = () => {
      // load and initialize auth2
      gapi.load('auth2', () => {
        gapi.auth2
          // Scope and fetching user profile information
          .init({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            fetch_basic_profile: true,
            scope: 'profile email',
          })
          .then((auth2) => {
            // If the data has already loaded then set loading to false
            setLoading(false);
            // Get signed account
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
                // updated the list
                onUpdateUserList(userProfile);
              }
            }

            // Listen to an events of the current logged user
            auth2.currentUser.listen((user) => {
              if (user.isSignedIn()) {
                const basicProfile = user.getBasicProfile();
                const userProfile = {
                  id: basicProfile.getId(),
                  email: basicProfile.getEmail(),
                  name: basicProfile.getName(),
                  imageUrl: basicProfile.getImageUrl(),
                };
                //update the list for new user
                onUpdateUserList(userProfile);
              } else {
                const signedOutUserEmail = user.getBasicProfile();
                const loggedUser = {
                  id: signedOutUserEmail.getId(),
                  email: signedOutUserEmail.getEmail(),
                  name: signedOutUserEmail.getName(),
                  imageUrl: signedOutUserEmail.getImageUrl(),
                };
                onUpdateUserList(loggedUser);
              }
            });
          })
          .catch((err: Error) => {
            setError(err);
          });
      });
    };

    initGapi();
  }, []);

  return { usersAuthList, loading, error };
};
