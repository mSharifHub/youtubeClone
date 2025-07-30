import { createContext, useContext } from 'react';
import { VideoNode } from '../../graphql/types.ts';

interface VideoContextType {
  selectedVideo: VideoNode | null;
  setSelectedVideo: (video: VideoNode | null) => void;
}

export const SelectedVideoContext = createContext<VideoContextType | undefined>(undefined);

export const useSelectedVideo = (): VideoContextType => {
  const context = useContext(SelectedVideoContext);

  if (!context) {
    throw new Error('useVideo must be used within  a selectedVideoProvider');
  }

  return context;
};
