import { CodeResponse, useGoogleLogin } from '@react-oauth/google';
import { useMutation } from '@apollo/client';

import googleIcon from '../assets/menu_bar_icons/google.png';
import { GOOGLE_AUTH } from '../graphql/queries.ts';

const LoginWithGoogle = () => {
  const [googleAuth] = useMutation(GOOGLE_AUTH);

  const handleOnLogIn = async (codeResponse: CodeResponse) => {
    console.log(
      'Front end debugging the code response from google api',
      codeResponse,
    );

    const { code } = codeResponse;

    try {
      const response = await googleAuth({
        variables: {
          code: code,
        },
      });

      console.log('front end response:', response);
    } catch (e) {
      console.error(e);
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
