import { Route, Routes, useLocation } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout.tsx';
import { Home } from './components/pages/Home.tsx';
import NotFound from './components/pages/NotFound.tsx';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { VideoPlayer } from './components/pages/VideoPlayer.tsx';
import { useEffect } from 'react';
config.autoAddCss = false;
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import useYoutubeVideos from './components/hooks/useYoutubeVideos.ts';

function App() {
  const { videos } = useYoutubeVideos();
  const location = useLocation();

  useEffect(() => {
    fetch('http://localhost:8000/api/csrf/', { credentials: 'include' });
  }, []);

  NProgress.configure({ showSpinner: false });

  useEffect(() => {
    if (location.pathname !== '/') return;

    if (videos.length === 0) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [location.pathname, videos.length]);


  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="watch" element={<VideoPlayer />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
