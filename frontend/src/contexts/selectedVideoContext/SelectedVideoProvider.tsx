import React, { useState } from 'react';
import { SelectedVideoContext } from './SelectedVideoContext.ts';
import { VideoNode } from '../../graphql/types.ts';

interface SelectedVideoProviderProps {
  children: React.ReactNode;
}

export const SelectedVideoProvider: React.FC<SelectedVideoProviderProps> = ({ children }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoNode | null>(null);

  return <SelectedVideoContext.Provider value={{ selectedVideo, setSelectedVideo }}>{children}</SelectedVideoContext.Provider>;
};
