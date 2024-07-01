import { gql, InMemoryCache, ApolloClient } from '@apollo/client';
import Cookies from 'js-cookie';

const tempClient = new ApolloClient({
  uri: 'http://127.0.0.1:8000/graphql/',
  credentials: 'same-origin',
  cache: new InMemoryCache(),
});

const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      token
      refreshToken
    }
  }
`;

export const isTokenExpired = (token: string): boolean => {
  const payload = JSON.parse(atob(token.split('.')[1]));
  const exp = payload.exp * 1000;
  return Date.now() > exp;
};

export const refreshAuthToken = async (
  refreshToken: string,
): Promise<{ token: string; refreshToken: string } | null> => {
  try {
    const response = await tempClient.mutate({
      mutation: REFRESH_TOKEN,
      variables: { refreshToken },
    });

    return response.data.refreshToken;
  } catch (error) {
    console.error('Failed to refresh token', error);
    return null;
  }
};

export const saveAuthToken = (
  token: string,
  refreshToken: string,
  user: any,
) => {
  const tokenExpires = new Date(new Date().getTime() + 30 * 60 * 1000); // 30 minutes
  const refreshTokenExpires = new Date(
    new Date().getTime() + 7 * 24 * 60 * 1000,
  );
  Cookies.set('JWT', token, { expires: tokenExpires });
  Cookies.set('JWT-refresh-token', refreshToken, {
    expires: refreshTokenExpires,
  });
  Cookies.set('user', JSON.stringify(user), { expires: refreshTokenExpires });
};

export const getAuthToken = (): {
  token: string;
  refreshToken: string;
  user: any;
} | null => {
  const token = Cookies.get('JWT');
  const refreshToken = Cookies.get('JWT-refresh-token');
  const user = Cookies.get('user')
    ? JSON.parse(Cookies.get('user') as string)
    : null;

  if (token && refreshToken && user) {
    return {
      token,
      refreshToken,
      user,
    };
  } else {
    return null;
  }
};

export const removeAuthToken = () => {
  Cookies.remove('JWT');
  Cookies.remove('JWT-refresh-token');
  Cookies.remove('user');
};
