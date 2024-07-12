import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie';

const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql/',
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  const csrftoken = Cookies.get('csrftoken');

  if (csrftoken) {
    return {
      headers: {
        ...headers,
        'X-CSRFToken': csrftoken,
      },
    };
  }

  return {
    headers: {
      ...headers,
      'X-CSRFToken': csrftoken ? csrftoken : null,
    },
  };
});

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );
    });
  }
});

const link = ApolloLink.from([authLink, errorLink, httpLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
