import { useGoogleLogin } from '@react-oauth/google';
import { useMutation, gql } from '@apollo/client';

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

const Login = () => {
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
    <div>
      <button onClick={() => googleLogin()}>Login with Google</button>
    </div>
  );
};

export default Login;
