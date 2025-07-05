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
import You from './components/pages/You.tsx';
import { ProtectedUserRoute } from './routerProtectors/ProtectedUserRoute.tsx';
import { useUser } from './contexts/userContext/UserContext.tsx';
import { useQuery } from '@apollo/client';
import { ViewerQuery } from './graphql/types.ts';
import { VIEWER_QUERY } from './graphql/queries/queries.ts';
import UserChannel from './components/userComponent/UserChannel.tsx';
function App() {
  const {
    state: { isLoggedIn },
  } = useUser();

  const { loading } = useQuery<ViewerQuery>(VIEWER_QUERY, {});

  useEffect(() => {
    fetch('http://localhost:8000/api/csrf/', { credentials: 'include' });
  }, []);

  useEffect(() => {
    console.log('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="watch" element={<VideoPlayer />} />
          <Route
            path="you"
            element={
              <ProtectedUserRoute isLoggedIn={isLoggedIn} loading={loading}>
                <You />
              </ProtectedUserRoute>
            }
          />
          <Route
            path=":youtubeHandler"
            element={
              <ProtectedUserRoute isLoggedIn={isLoggedIn} loading={loading}>
                <UserChannel />
              </ProtectedUserRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
