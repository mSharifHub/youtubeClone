import { Video } from '../../types/youtubeVideoInterfaces.ts';
import { useCallback, useState } from 'react';
import { fetchVideoStatistics } from '../../helpers/fetchVideoStatistics.ts';
import { fetchChannelDetails } from '../../helpers/fetchChannelDetails.ts';
import axios from 'axios';
import { getVideoId } from '../../helpers/getVideoId.ts';

interface useYoutubeRelatedVideosOptions {
  relatedVideos: Video[] | [];
  relatedVideosLoading: boolean;
  relatedVideosError: string | null;
}

const MAX_DEFAULT = 10;

export default function useYoutubeRelatedVideos(apiKey: string): useYoutubeRelatedVideosOptions {
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [relatedVideosLoading, setRelatedVideosLoading] = useState(false);
  const [relatedVideosError, setRelatedVideosError] = useState<string | null>(null);

  const fetchRelatedVideos = useCallback(
    async (categoryId: string) => {
      if (relatedVideosLoading || !categoryId) return;

      setRelatedVideosLoading(true);
      setRelatedVideosError(null);

      try {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&videoCategoryId=${categoryId}&maxResults=${MAX_DEFAULT}&q=trending&regionCode=US`;
        const response = await axios.get(url);
        const { data } = response;

        if (!data.items || data.items.length === 0) {
          setRelatedVideos([]);
          setRelatedVideosLoading(false);
          return;
        }

        const videoItems: Video[] = data.items;
        const videoIds: string[] = videoItems.map((video: Video) => getVideoId(video.id));
        const channelIds: string[] = [...new Set(videoItems.map((video: Video) => video.snippet.channelId))];

        const statisticsMap = await fetchVideoStatistics(videoIds);
        const channelMap = await fetchChannelDetails(channelIds);

        const fetchedVideoData: Video[] = videoItems.map((video) => {
          const _videoId = getVideoId(video.id);
          return {
            ...video,
            id: {
              videoId: _videoId,
            },
            statistics: {
              ...video.statistics,
              viewCount: statisticsMap[_videoId]?.viewCount,
              likeCount: statisticsMap[_videoId]?.likeCount,
              dislikeCount: statisticsMap[_videoId]?.dislikeCount,
              commentCount: statisticsMap[_videoId]?.commentCount,
              duration: statisticsMap[_videoId]?.duration,
            },
            snippet: {
              ...video.snippet,
              title: video.snippet.title,
              channelTitle: channelMap[video.snippet.channelId]?.channelTitle,
              channelLogo: channelMap[video.snippet.channelId]?.logo,
              publishedAt: video.snippet.publishedAt,
              subscriberCount: channelMap[video.snippet.channelId]?.subscriberCount,
              channelDescription: channelMap[video.snippet.channelId]?.channelDescription,
              description: video.snippet.description,
              categoryId: video.snippet.categoryId,
            },
          };
        });

        setRelatedVideos((previous) => {
          const existingIds = new Set(previous.map((v) => getVideoId(v.id)));
          const newVideos = fetchedVideoData.filter((video) => !existingIds.has(getVideoId(video.id)));
          return [...previous, ...newVideos];
        });
      } catch (error) {
        setRelatedVideosError(error instanceof Error ? error.message : 'An error occurred while fetching related videos');
        throw new Error(error instanceof Error ? error.message : 'An error occurred while fetching related videos');
      } finally {
        setRelatedVideosLoading(false);
      }
    },
    [apiKey],
  );

  // useEffect(() => {
  //   if (!selectedVideo) return;
  //   const load = async () => {
  //     setRelatedVideos([]);
  //     await fetchRelatedVideos(selectedVideo.snippet.categoryId);
  //   };
  //   load();
  // }, [selectedVideo]);

  return {
    relatedVideos,
    relatedVideosLoading,
    relatedVideosError,
  };
}
