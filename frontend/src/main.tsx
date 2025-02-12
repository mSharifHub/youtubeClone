import React from 'react';
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';
import App from './App.tsx';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/apolloClient.ts';
import './index.css';

import { UserProvider } from './userContext/UserProvider.tsx';
import { ThemeProvider } from './components/settingsComponents/darkModeContext/ThemeProvider.tsx';
import { MenuBarProvider } from './components/menuBarComponents/menuBarContext/MenuBarProvider.tsx';
import { SettingModalsProvider } from './components/settingsComponents/SetttingsModalsContext/SettingModalsProvider.tsx';
import { GoogleApiProvider } from 'react-gapi'

Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleApiProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ApolloProvider client={client}>
        <UserProvider>
          <ThemeProvider>
            <MenuBarProvider>
              <SettingModalsProvider>
                <App />
              </SettingModalsProvider>
            </MenuBarProvider>
          </ThemeProvider>
        </UserProvider>
      </ApolloProvider>
    </GoogleApiProvider>
  </React.StrictMode>,
);
