import React, { useEffect, useState } from 'react';
import { SelectedVideoContext } from './SelectedVideoContext.ts';
import { Video } from '../../types/youtubeVideoInterfaces.ts';
import useFetchSingleVideo from '../../components/hooks/useFetchSingleVideo.ts';

interface SelectedVideoProviderProps {
  children: React.ReactNode;
}

export const SelectedVideoProvider: React.FC<SelectedVideoProviderProps> = ({ children }) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const apiKey: string = import.meta.env.VITE_YOUTUBE_API_3;

  const { singleVideo } = useFetchSingleVideo(apiKey);

  useEffect(() => {
    if (singleVideo) {
      setSelectedVideo(singleVideo);
    }
  }, [singleVideo]);

  return <SelectedVideoContext.Provider value={{ selectedVideo, setSelectedVideo }}>{children}</SelectedVideoContext.Provider>;
};
