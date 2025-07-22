import { useNavigate } from 'react-router-dom';
import { Video } from '../../types/youtubeVideoInterfaces.ts';
import { useSelectedVideo } from '../../contexts/selectedVideoContext/SelectedVideoContext.ts';
import { useCallback } from 'react';
import { useSaveVideoOnPlaylist } from './useSaveVideoOnPlaylist.ts';

export const useHandleSelectedVideo = () => {
  const navigate = useNavigate();

  const { saveVideoPlaylist, loading, error } = useSaveVideoOnPlaylist();

  const { setSelectedVideo } = useSelectedVideo();
  return useCallback(
    async (video: Video | null) => {
      if (!video) return;
      setSelectedVideo(video);

      if (!loading && !error) {
        await saveVideoPlaylist({
          variables: {
            video: {
              videoId: video.id.videoId,
              title: video.snippet.title ?? '',
              description: video.snippet.description ?? '',
              thumbnailDefault: video.snippet.thumbnails?.default?.url ?? '',
              thumbnailMedium: video.snippet.thumbnails?.medium?.url ?? '',
              channelId: video.snippet.channelId ?? '',
              channelTitle: video.snippet.channelTitle ?? '',
              publishedAt: video.snippet.publishedAt ?? '',
              duration: video.contentDetails?.duration ?? '',
              viewCount: video.statistics?.viewCount ?? '',
              likeCount: video.statistics?.likeCount ?? '',
              commentCount: video.statistics?.commentCount ?? '',
              categoryId: video.snippet.categoryId ?? '',
              channelDescription: video.snippet.channelDescription ?? '',
            },
          },
        });
      }

      navigate(`/watch?v=${video.id.videoId}`);
    },
    [navigate, setSelectedVideo],
  );
};
