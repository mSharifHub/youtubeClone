// import { CodeResponse, useGoogleLogin } from '@react-oauth/google';
// import { useMutation } from '@apollo/client';
// import { GOOGLE_AUTH, VIEWER_QUERY } from '../graphql/queries/queries.ts';
// import {
//   GoogleAuthMutation,
//   GoogleAuthMutationVariables,
//   ViewerQuery,
// } from '../graphql/types.ts';
// import client from '../graphql/apolloClient.ts';
// import { useUser } from '../userContext/UserContext.tsx';
//
// export const useLoginWithGoogle = () => {
//   const { dispatch } = useUser();
//   const [googleAuth] = useMutation<
//     GoogleAuthMutation,
//     GoogleAuthMutationVariables
//   >(GOOGLE_AUTH);
//
//   const handleOnLogIn = async (codeResponse: CodeResponse) => {
//     const { code } = codeResponse;
//
//     try {
//       const response = await googleAuth({
//         variables: {
//           code: code,
//         },
//       });
//
//       if (response && response.data?.googleAuth) {
//         const { isSuccess } = response.data.googleAuth;
//
//         if (isSuccess) {
//           try {
//             const { data } = await client.query<ViewerQuery>({
//               query: VIEWER_QUERY,
//             });
//             if (data && data.viewer) {
//               dispatch({ type: 'SET_USER', payload: data.viewer });
//             } else {
//               console.error('Failed to retrieve viewer');
//             }
//           } catch (innerError) {
//             console.error('error fetching viewer', innerError);
//           }
//         }
//       }
//     } catch (outerError) {
//       console.error('Error during google api authentication', outerError);
//     }
//   };
//
//   return useGoogleLogin({
//     onSuccess: handleOnLogIn,
//     ux_mode: 'redirect',
//     redirect_uri: 'http://localhost:5173',
//     flow: 'auth-code',
//   });
// };
