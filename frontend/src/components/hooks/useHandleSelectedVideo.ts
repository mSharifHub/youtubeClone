import { useNavigate } from 'react-router-dom';
import { Video } from '../../types/youtubeVideoInterfaces.ts';
import { useSelectedVideo } from '../../contexts/selectedVideoContext/SelectedVideoContext.ts';
import { useCallback } from 'react';
// import { useCreateVideoHistory } from './useSaveVideoOnPlaylist.ts';


export const useHandleSelectedVideo = () => {
  const navigate = useNavigate();
  // const { saveVideo } = useCreateVideoHistory();

  const { setSelectedVideo } = useSelectedVideo();
  return useCallback(
    async (video: Video | null) => {
      if (!video) return;
      setSelectedVideo(video);

      // await saveVideo({
      //   variables: {
      //     videoId: video.id.videoId,
      //     title: video.snippet.title ?? '',
      //     thumbnailDefault: video.snippet.thumbnails?.default?.url ?? '',
      //   },
      // });
      navigate(`/watch?v=${video.id.videoId}`);
    },
    [navigate, setSelectedVideo],
  );
};
