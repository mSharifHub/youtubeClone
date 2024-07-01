import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import {
  getAuthToken,
  isTokenExpired,
  refreshAuthToken,
  removeAuthToken,
  saveAuthToken,
} from './authHelper.ts';
import Cookies from 'js-cookie';

const httpLink = createHttpLink({
  uri: 'http://127.0.0.1:8000/graphql/',
  credentials: 'same-origin', // include if not same domain
});

const authLink = setContext(async (_, { headers }) => {
  try {
    const csrfToken = Cookies.get('csrftoken');
    const tokens = getAuthToken();

    if (tokens) {
      const { token, refreshToken } = tokens;

      const isExpired = isTokenExpired(token);

      if (isExpired && refreshToken) {
        const newTokenData = await refreshAuthToken(refreshToken);

        if (newTokenData) {
          console.log('new token generated'); // debug
          const { token, refreshToken } = newTokenData;
          saveAuthToken(token, refreshToken);

          const headersContent = {
            ...headers,
            authorization: `JWT ${token}`,
            'X-CSRFToken': csrfToken,
          };

          return { headers: headersContent };
        } else {
          removeAuthToken();
        }
      } else {
        const headersContent = {
          ...headers,
          authorization: token ? `JWT ${token}` : '',
          'X-CSRFToken': csrfToken,
        };

        return { headers: headersContent };
      }
    }
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
