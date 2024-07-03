import { useGoogleLogin } from '@react-oauth/google';
import { useMutation } from '@apollo/client';
import { useUser } from '../context/UserContext.tsx';
import googleIcon from '../assets/menu_bar_icons/google.png';
import { saveAuthToken } from '../graphql/authHelper.ts';
import { SOCIAL_AUTH } from '../graphql/queries.ts';

const LoginWithGoogle = () => {
  const [socialAuth] = useMutation(SOCIAL_AUTH);
  const { dispatch } = useUser();

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
            const { user, token, refreshToken } = response.data.socialAuth;
            saveAuthToken(token, refreshToken);
            dispatch({ type: 'SET_USER', payload: user });
          }
        })
        .catch((err) => {
          console.error('Authentication error:', err);
        });
    },
  });

  return (
    <button
      className="w-80 h-16 flex justify-start items-center rounded-lg border-2 shadow-md transition-colors duration-75 ease-out hover:bg-slate-50"
      onClick={() => googleLogin()}
    >
      <img src={googleIcon} alt="GoogleIcon" className="mx-2 h-10 w-10" />
      <span className="capitalize font-semibold mx-4 ">
        authenticate with google
      </span>
    </button>
  );
};

export default LoginWithGoogle;
