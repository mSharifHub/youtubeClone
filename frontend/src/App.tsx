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
import UserChannel from './components/userComponents/UserChannel.tsx';
import { You } from './components/userComponents/You.tsx';

function App() {
  const {
    state: { isLoggedIn },
    loadingQuery,
  } = useUser();

  //TODO change to be handled in the back end
  useEffect(() => {
    fetch('http://localhost:8000/api/csrf/', { credentials: 'include' });
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="watch" element={<VideoPlayer />} />
          <Route path="/you" element={<You />} />
        </Route>

        {/**  //TODO ADD router protector */}

        <Route
          path=":youtubeHandler"
          element={
            <ProtectedUserRoute isLoggedIn={isLoggedIn} loading={loadingQuery}>
              <UserChannel />
            </ProtectedUserRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
