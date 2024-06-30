import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { isTokenExpired, refreshAuthToken } from './authHelper.ts';

const httpLink = createHttpLink({
  uri: 'http://127.0.0.1:8000/graphql/',
});

const authLink = setContext(async (_, { headers }) => {
  try {
    // check for token and refresh token in the  local storage
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    // if token than check if it  has expired
    if (token) {
      const isExpired = isTokenExpired(token);
      // if expired and there is a refresh token in local storage call function to create a new token
      if (isExpired && refreshToken) {
        const newTokenData = await refreshAuthToken(refreshToken);
        if (newTokenData) {
          console.log('new token generated');
          const { token, refreshToken } = newTokenData;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);

          return {
            headers: {
              ...headers,
              authorization: `JWT ${token}`,
            },
          };
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          console.log(
            'Refresh token failed. tokens removed from local storage',
          );
        }
      }
    }

    return {
      headers: {
        ...headers,
        authorization: token ? `JWT ${token}` : '',
      },
    };
  } catch (error) {
    console.error('error during token handling', error);
    return {
      headers,
    };
  }
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );
    });
  }

  if (networkError) {
    console.error(`[GraphQL error]: Network Error: ${networkError}`);
  }
});

const link = ApolloLink.from([authLink, errorLink, httpLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
