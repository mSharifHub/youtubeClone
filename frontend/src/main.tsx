import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';
import App from './App.tsx';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/apolloClient.ts';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './contexts/userContext/UserProvider.tsx';
import { ThemeProvider } from './contexts/darkModeContext/ThemeProvider.tsx';
import { MenuBarProvider } from './contexts/menuBarContext/MenuBarProvider.tsx';
import { SettingModalsProvider } from './contexts/SetttingsModalsContext/SettingModalsProvider.tsx';
import { SelectedVideoProvider } from './contexts/selectedVideoContext/SelectedVideoProvider.tsx';

Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <ApolloProvider client={client}>
      <UserProvider>
        <SelectedVideoProvider>
          <ThemeProvider>
            <MenuBarProvider>
              <SettingModalsProvider>
                <App />
              </SettingModalsProvider>
            </MenuBarProvider>
          </ThemeProvider>
        </SelectedVideoProvider>
      </UserProvider>
    </ApolloProvider>
  </GoogleOAuthProvider>,
);
