import { CodeResponse, useGoogleLogin } from '@react-oauth/google';
import { useMutation } from '@apollo/client';
import googleIcon from '../assets/menu_bar_icons/google.png';
import { GOOGLE_AUTH, VIEWER_QUERY } from '../graphql/queries/queries.ts';
import {
  GoogleAuthMutation,
  GoogleAuthMutationVariables,
  ViewerQuery,
} from '../graphql/types.ts';
import client from '../graphql/apolloClient.ts';
import { useUser } from '../userContext/UserContext.tsx';

const LoginWithGoogle = () => {
  const { dispatch } = useUser();
  const [googleAuth] = useMutation<
    GoogleAuthMutation,
    GoogleAuthMutationVariables
  >(GOOGLE_AUTH);

  const handleOnLogIn = async (codeResponse: CodeResponse) => {
    const { code } = codeResponse;

    try {
      const response = await googleAuth({
        variables: {
          code: code,
        },
      });

      if (response && response.data?.googleAuth) {
        const { isSuccess } = response.data.googleAuth;

        if (isSuccess) {
          try {
            const { data } = await client.query<ViewerQuery>({
              query: VIEWER_QUERY,
            });
            if (data && data.viewer) {
              dispatch({ type: 'SET_USER', payload: data.viewer });
            } else {
              console.error('Failed to retrieve viewer');
            }
          } catch (innerError) {
            console.error('error fetching viewer', innerError);
          }
        }
      }
    } catch (outerError) {
      console.error('Error during google api authentication', outerError);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleOnLogIn,
    flow: 'auth-code',
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
