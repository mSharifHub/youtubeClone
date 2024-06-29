import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/apolloClient.ts';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
