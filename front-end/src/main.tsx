import React from 'react';
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';
import App from './App.tsx';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/apolloClient.ts';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './context/UserProvider.tsx';

Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ApolloProvider client={client}>
        <UserProvider>
          <App />
        </UserProvider>
      </ApolloProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
