import { gql, InMemoryCache, ApolloClient } from '@apollo/client';

const tempClient = new ApolloClient({
  uri: 'http://127.0.0.1:8000/graphql/',
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
