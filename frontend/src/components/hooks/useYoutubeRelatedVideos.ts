import { Video } from '../helpers/youtubeVideoInterfaces.ts';
import { useEffect, useState } from 'react';
import { fetchVideoStatistics } from '../helpers/fetchVideoStatistics.ts';
import { fetchChannelDetails } from '../helpers/fetchChannelDetails.ts';
import axios from 'axios';
import { useSelectedVideo } from '../../contexts/selectedVideoContext/SelectedVideoContext.ts';

interface useYoutubeRelatedVideosOptions {
  relatedVideos: Video[] | [];
  relatedVideosLoading: boolean;
  relatedVideosError: string | null;
}

export default function useYoutubeRelatedVideos(apiKey: string): useYoutubeRelatedVideosOptions {
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [relatedVideosLoading, setRelatedVideosLoading] = useState(false);
  const [relatedVideosError, setRelatedVideosError] = useState<string | null>(null);

  const { selectedVideo } = useSelectedVideo();

  const fetchRelatedVideos = async (categoryId: string) => {
    if (relatedVideosLoading || !categoryId) return;

    setRelatedVideosLoading(true);
    setRelatedVideosError(null);

    try {
      const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&videoCategoryId=${categoryId}&maxResults=10&q=trending`;
      const { data } = await axios.get(url);

      if (!data.items || data.items.length === 0) {
        setRelatedVideos([]);
        setRelatedVideosLoading(false);
        return;
      }

      const videoItems: Video[] = data.items;
      const videoIds: string[] = videoItems.map((video: Video) => video.id.videoId);
      const channelIds: string[] = [...new Set(videoItems.map((video: Video) => video.snippet.channelId))];

      const statisticsMap = await fetchVideoStatistics(videoIds);
      const channelMap = await fetchChannelDetails(channelIds);

      const fetchedVideoData: Video[] = videoItems.map((video) => ({
        ...video,
        statistics: {
          ...video.statistics,
          viewCount: statisticsMap[video.id.videoId]?.viewCount,
          likeCount: statisticsMap[video.id.videoId]?.likeCount,
          dislikeCount: statisticsMap[video.id.videoId]?.dislikeCount,
          commentCount: statisticsMap[video.id.videoId]?.commentCount,
          duration: statisticsMap[video.id.videoId]?.duration,
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
          categoryId: statisticsMap[video.id.videoId]?.categoryId || '',
        },
      }));

      setRelatedVideos((previous) => {
        const newVideos = fetchedVideoData.filter((video) => !previous.some((v) => v.id.videoId === video.id.videoId));
        if (newVideos.length === 0) return previous;
        return [...previous, ...newVideos];
      });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'An error occurred while fetching related videos');
    } finally {
      setRelatedVideosLoading(false);
    }
  };

  return {
    relatedVideos,
    relatedVideosLoading,
    relatedVideosError,
  };
}
