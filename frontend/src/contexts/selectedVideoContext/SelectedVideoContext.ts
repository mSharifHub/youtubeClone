import { createContext, useContext } from 'react';
import { Video } from '../../components/hooks/useYoutubeVideos.ts';

interface VideoContextType {
  selectedVideo: Video | null;
  setCurrentVideo: (video: Video | null) => void;
}

export const SelectedVideoContext = createContext<VideoContextType | undefined>(undefined);

export const useSelectedVideo = (): VideoContextType => {
  const context = useContext(SelectedVideoContext);

  if (!context) {
    throw new Error('useVideo must be used within  a selectedVideoProvider');
  }

  return context;
};
