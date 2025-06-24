import React, { useState } from 'react';
import { SelectedVideoContext } from './SelectedVideoContext.ts';
import { Video } from '../../components/helpers/youtubeVideoInterfaces.ts';

interface SelectedVideoProviderProps {
  children: React.ReactNode;
}

export const SelectedVideoProvider: React.FC<SelectedVideoProviderProps> = ({ children }) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return <SelectedVideoContext.Provider value={{ selectedVideo, setSelectedVideo }}>{children}</SelectedVideoContext.Provider>;
};
