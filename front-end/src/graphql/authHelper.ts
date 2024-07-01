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

// check if token is expired to refresh token automatically
export const isTokenExpired = (token: string): boolean => {
  const payload = JSON.parse(atob(token.split('.')[1]));
  const exp = payload.exp * 1000;
  return Date.now() > exp;
};

// called if token is expired to get a new set token
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

// Used to refresh token
export const saveAuthToken = (token: string, refreshToken: string) => {
  const tokenExpires = new Date(new Date().getTime() + 30 * 60 * 1000); // 30 minutes
  const refreshTokenExpires = new Date(
    new Date().getTime() + 7 * 24 * 60 * 1000,
  );
  Cookies.set('JWT', token, { expires: tokenExpires });
  Cookies.set('JWT-refresh-token', refreshToken, {
    expires: refreshTokenExpires,
  });
};

export const getAuthToken = (): {
  token: string;
  refreshToken: string;
} | null => {
  const token = Cookies.get('JWT');
  const refreshToken = Cookies.get('JWT-refresh-token');

  if (token && refreshToken) {
    return {
      token,
      refreshToken,
    };
  } else {
    return null;
  }
};

export const removeAuthToken = () => {
  Cookies.remove('JWT');
  Cookies.remove('JWT-refresh-token');
};
