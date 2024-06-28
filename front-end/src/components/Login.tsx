import { useGoogleLogin } from '@react-oauth/google';
import { useMutation, gql } from '@apollo/client';
import gogoleIcon from '../assets/menu_bar_icons/google.png';

const SOCIAL_AUTH = gql`
  mutation SocialAuth($provider: String!, $accessToken: String!) {
    socialAuth(provider: $provider, accessToken: $accessToken) {
      user {
        username
        profilePicture
        bio
        isVerified
        email
        subscribers {
          username
        }
      }
      token
      refreshToken
    }
  }
`;

const LoginWithGoogle = () => {
  const [socialAuth] = useMutation(SOCIAL_AUTH);

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      socialAuth({
        variables: {
          provider: 'google-oauth2',
          accessToken: tokenResponse.access_token,
        },
      })
        .then((response) => {
          if (response.data) {
            console.log(response.data);
            localStorage.setItem('token', response.data.socialAuth.token);
            // Handle user data (e.g., update context or state)
          }
        })
        .catch((err) => {
          console.error('Authentication error:', err);
        });
    },
  });

  return (
    <button
      className="w-80 h-16 flex justify-start items-center rounded-lg border-2 shadow-md"
      onClick={() => googleLogin()}
    >
      <img src={gogoleIcon} alt="GoogleIcon" className="mx-2 h-10 w-10" />
      <span className="capitalize font-semibold mx-4 ">
        authenticate with google
      </span>
    </button>
  );
};

export default LoginWithGoogle;
