import { useNavigate } from 'react-router-dom';
import { Video } from '../../helpers/youtubeVideoInterfaces.ts';
import { useSelectedVideo } from '../../contexts/selectedVideoContext/SelectedVideoContext.ts';
import { useCallback } from 'react';

export const useHandleSelectedVideo = () => {
  const navigate = useNavigate();

  const { setSelectedVideo } = useSelectedVideo();
  return useCallback(
    (video: Video | null) => {
      if (!video) return;
      setSelectedVideo(video);
      navigate(`/watch?v=${video.id.videoId}`);
    },
    [navigate, setSelectedVideo],
  );
};
