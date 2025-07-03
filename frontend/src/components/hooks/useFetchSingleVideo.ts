import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Video } from '../../helpers/youtubeVideoInterfaces.ts';
import { useNavigationType, useSearchParams } from 'react-router-dom';

interface UseFetchSingleVideoOptions {
  singleVideo: Video | null;
  singleVideoLoading: boolean;
  videoError: string | null;
}

export default function useFetchSingleVideo(apiKey?: string): UseFetchSingleVideoOptions {
  const [singleVideo, setSingleVideo] = useState<Video | null>(null);
  const [singleVideoLoading, setSingleVideoLoading] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const navigationType = useNavigationType();

  const fetchVideo = useCallback(
    async ({ videoId }: { videoId: string }) => {
      if (singleVideoLoading) return;

      setSingleVideoLoading(true);
      setVideoError(null);

      try {
        const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`;

        const videoResponse = await axios.get(videoUrl);

        if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
          setSingleVideoLoading(false);
          setVideoError(videoResponse.statusText || 'An error occurred while fetching video');
          return;
        }

        const item = videoResponse.data.items[0];

        const channelId = item.snippet?.channelId;

        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
        const channelResponse = await axios.get(channelUrl);

        const channelItem = channelResponse.data.items[0];

        const video = {
          id: { videoId: item.id },
          snippet: {
            title: item.snippet?.title,
            description: item.snippet?.description,
            thumbnails: item.snippet?.thumbnails,
            channelId: item.snippet?.channelId,
            channelTitle: item.snippet?.channelTitle,
            channelDescription: channelItem?.snippet?.description,
            channelLogo: channelItem?.snippet?.thumbnails?.default?.url,
            publishedAt: item.snippet?.publishedAt,
            subscriberCount: channelItem?.statistics?.subscriberCount,
            categoryId: item.snippet?.categoryId,
          },
          statistics: {
            viewCount: item.statistics.viewCount,
            likeCount: item.statistics.likeCount,
            dislikeCount: item.statistics.dislikeCount,
            commentCount: item.statistics.commentCount,
            duration: item.contentDetails?.duration,
            categoryId: item.snippet?.categoryId,
          },
          contentDetails: {
            duration: item.contentDetails.duration,
          },
        };

        if (video) {
          setSingleVideo(video);
        }
      } catch (err) {
        setVideoError(err instanceof Error ? err.message : 'An error occurred while fetching video');
        throw new Error(err instanceof Error ? err.message : 'An error occurred while fetching video');
      } finally {
        setSingleVideoLoading(false);
        setVideoError(null);
      }
    },
    [apiKey],
  );

  useEffect(() => {
    const syncSelectedVideos = async () => {
      const videoId = searchParams.get('v');
      if (!videoId) return;
      if (navigationType === 'POP') {
        await fetchVideo({ videoId });
      }
    };
    syncSelectedVideos();
  }, [fetchVideo, navigationType, searchParams]);

  return {
    singleVideoLoading,
    videoError,
    singleVideo,
  };
}
