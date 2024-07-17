import React from 'react';
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';
import App from './App.tsx';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/apolloClient.ts';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './userContext/UserProvider.tsx';
import { ThemeProvider } from './darkModeContext/ThemeProvider.tsx';

Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ApolloProvider client={client}>
        <UserProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </UserProvider>
      </ApolloProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
