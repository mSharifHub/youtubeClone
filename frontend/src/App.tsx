import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout.tsx';
import { Home } from './components/pages/Home.tsx';
import NotFound from './components/pages/NotFound.tsx';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { VideoPlayer } from './components/pages/VideoPlayer.tsx';
import { useEffect } from 'react';
config.autoAddCss = false;
import 'nprogress/nprogress.css';
import { ProtectedUserRoute } from './routerProtectors/ProtectedUserRoute.tsx';
import { useUser } from './contexts/userContext/UserContext.tsx';
import UserChannel from './components/userComponent/UserChannel.tsx';
import { RedirectToOwnChannel } from './routerProtectors/RedirectToOwnChannel.tsx';

function App() {
  const {
    state: { isLoggedIn },
    loadingQuery,
  } = useUser();

  // fetch the csrf on start of the application from Django backend
  useEffect(() => {
    fetch('http://localhost:8000/api/csrf/', { credentials: 'include' });
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="watch" element={<VideoPlayer />} />

          <Route path="/user">
            <Route index element={<RedirectToOwnChannel isLoggedIn={isLoggedIn} loading={loadingQuery} />} />
            <Route
              path=":youtubeHandler"
              element={
                <ProtectedUserRoute isLoggedIn={isLoggedIn} loading={loadingQuery}>
                  <UserChannel />
                </ProtectedUserRoute>
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
