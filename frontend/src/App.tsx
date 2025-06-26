import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout.tsx';
import { Home } from './components/pages/Home.tsx';
import NotFound from './components/pages/NotFound.tsx';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { VideoPlayer } from './components/pages/VideoPlayer.tsx';
config.autoAddCss = false;

function App() {
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
