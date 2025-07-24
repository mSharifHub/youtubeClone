import { useNavigate } from 'react-router-dom';
import { Video } from '../../types/youtubeVideoInterfaces.ts';
import { useSelectedVideo } from '../../contexts/selectedVideoContext/SelectedVideoContext.ts';
import { useCallback } from 'react';
import { useSaveVideoOnPlaylist } from './useSaveVideoOnPlaylist.ts';

export const useHandleSelectedVideo = () => {
  const navigate = useNavigate();

  const { saveVideoPlaylist,loading, error } = useSaveVideoOnPlaylist();

  const { setSelectedVideo } = useSelectedVideo();

  return useCallback(
    async (video: Video | null) => {
      if (!video) return;


      setSelectedVideo(video);

      if (!loading && !error) {
        await saveVideoPlaylist({
          variables: {
            video: {
              id: {
                videoId: video.id.videoId,
              },
              snippet: {
                title: video.snippet.title ?? '',
                description: video.snippet.description ?? '',

                thumbnails: {
                  default: { url: video.snippet.thumbnails?.default?.url ?? '' },
                  medium: { url: video.snippet.thumbnails?.medium?.url ?? '' },
                },
                channelId: video.snippet.channelId ?? '',
                channelTitle: video.snippet.channelTitle ?? '',
                publishedAt: video.snippet.publishedAt ?? '',
                categoryId: video.snippet.categoryId ?? '',
                channelDescription: video.snippet.channelDescription ?? '',
                subscriberCount: video.snippet.subscriberCount ?? '',
                channelLogo: video.snippet.channelLogo ?? '',
              },
              statistics: {
                duration: video.statistics?.duration ?? '',
                viewCount: video.statistics?.viewCount ?? '',
                likeCount: video.statistics?.likeCount ?? '',
                commentCount: video.statistics?.commentCount ?? '',
              },
            },
          },
        });
      }
      navigate(`/watch?v=${video.id.videoId}`);
    },
    [navigate, setSelectedVideo],
  );
};
