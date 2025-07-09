import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie';

const httpLink = createUploadLink({
  uri: 'http://localhost:8000/graphql/',
  credentials: 'include',
});

const csrfLink = setContext((_, { headers }) => {
  const csrftoken = Cookies.get('csrftoken');
  return {
    headers: {
      ...headers,
      ...(csrftoken ? { 'X-CSRFToken': csrftoken } : {}),
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const link = ApolloLink.from([errorLink, csrfLink, httpLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
