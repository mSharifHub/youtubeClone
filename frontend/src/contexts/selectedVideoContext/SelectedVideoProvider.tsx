import React, { useEffect, useState } from 'react';
import { SelectedVideoContext } from './SelectedVideoContext.ts';
import { Video } from '../../helpers/youtubeVideoInterfaces.ts';
import { useNavigationType, useSearchParams } from 'react-router-dom';
import { fetchVideo } from '../../helpers/FetchVideo.ts';

interface SelectedVideoProviderProps {
  apiKey: string;
  children: React.ReactNode;
}

export const SelectedVideoProvider: React.FC<SelectedVideoProviderProps> = ({ apiKey, children }) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchParams] = useSearchParams();

  const navigationType = useNavigationType();

  useEffect(() => {
    const syncSelectedVideos = async () => {
      const videoId = searchParams.get('v');

      if (!videoId) return;

      if (navigationType === 'POP') {
        const video = await fetchVideo(videoId, apiKey);
        console.log("updating the selected video context",video)
        if (!video) return;
        setSelectedVideo(video);
      }
    };
    syncSelectedVideos()
  }, [apiKey, navigationType, searchParams]);


  return <SelectedVideoContext.Provider value={{ selectedVideo, setSelectedVideo }}>{children}</SelectedVideoContext.Provider>;
};
