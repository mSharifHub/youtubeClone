import React, { useEffect, useState } from 'react';
import { SelectedVideoContext } from './SelectedVideoContext.ts';
import { Video } from '../../components/helpers/youtubeVideoInterfaces.ts';
import { useSearchParams } from 'react-router-dom';
import { fetchVideo } from '../../components/helpers/FetchVideo.ts';

interface SelectedVideoProviderProps {
  apiKey: string;
  children: React.ReactNode;
}

export const SelectedVideoProvider: React.FC<SelectedVideoProviderProps> = ({ apiKey, children }) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const videoId = searchParams.get('v');

    const reloadSelectedVideo = async () => {
      if (!selectedVideo && videoId) {
        console.log('fetching video on provider');
        const video = await fetchVideo(videoId, apiKey);
        if (video) setSelectedVideo(video);
      }
    };
    reloadSelectedVideo();
  }, [apiKey, searchParams, selectedVideo]);

  return <SelectedVideoContext.Provider value={{ selectedVideo, setSelectedVideo }}>{children}</SelectedVideoContext.Provider>;
};
