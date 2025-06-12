import React, { useState } from 'react';
import { Video } from '../../components/hooks/useYoutubeVideos.ts';
import { SelectedVideoContext } from './SelectedVideoContext.ts';

interface SelectedVideoProviderProps {
  children: React.ReactNode;
}

export const SelectedVideoProvider: React.FC<SelectedVideoProviderProps> = ({ children }) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return <SelectedVideoContext.Provider value={{ selectedVideo, setSelectedVideo }}>{children}</SelectedVideoContext.Provider>;
};
