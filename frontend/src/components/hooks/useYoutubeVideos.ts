import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import LocalCache from '../../apiCache/LocalCache.ts';

export interface VideoSnippet {
  title?: string;
  description: string;
  thumbnails?: {
    default?: {
      url: string;
    };
    medium?: {
      url: string;
    };
    high?: {
      url: string;
    };
  };
  channelId: string;
  channelTitle: string;
  channelLogo?: string;
  publishedAt: string;
}

export interface VideoStatistics {
  viewCount: string;
  likeCount?: string;
  duration?: string;
}

export interface VideoId {
  videoId: string;
}

export interface Video {
  id: VideoId;
  snippet: VideoSnippet;
  statistics?: VideoStatistics;
}

interface UseYoutubeVideosResult {
  videos: Video[];
  loading: boolean | null;
  error: string | null;
  playVideo: (videoId: string) => void;
  loadMoreVideos: () => void;
}

export default function useYoutubeVideos(
  apiKey: string,
  maxResult: number,
  section: string,
  isInfiniteScroll: boolean = false,
): UseYoutubeVideosResult {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const cachedVideos = LocalCache.getInstance();
  const cacheVideosKey = `youtube_videos_${section}`;
  const cacheNextPageTokenKey = `next_page_${section}`;

  function playVideo(videoId: string): void {
    setSelectedVideoId(videoId);
  }

  /*
    to fetch video statistics
   */
  const fetchVideoStatistics = async (videoIds: string[]) => {
    try {
      const idsString = videoIds.join(',');

      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${idsString}&part=statistics,contentDetails`,
      );

      if (!response.data.items || response.data.items.length === 0) {
        console.warn('No video statistics found for the given video ids');
        return {};
      }

      return response.data.items.reduce((map: Record<string, VideoStatistics>, item) => {
        map[item.id] = {
          viewCount: item.statistics?.viewCount || '0',
          likeCount: item.statistics?.likeCount || '0',
          duration: item.contentDetails?.duration || '0',
        };
        return map;
      }, {});
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : 'Failed to fetch video statistics.');
    }
  };

  // /*
  //  *Fetch additional video details
  //  */
  const fetchChannelDetails = async (channelIds: string[]) => {
    try {
      const idsString = channelIds.join(',');
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${idsString}&part=snippet`,
      );

      if (!response.data.items || response.data.items.length === 0) {
        console.warn('No video details found for the given video ids');
        return {};
      }

      return response.data.items.reduce((map: Record<string, { channelId: string; title?: string; logo?: string }>, item) => {
        map[item.id] = {
          channelId: item.id,
          title: item.snippet?.title,
          logo: item.snippet.thumbnails?.default?.url,
        };
        return map;
      }, {});
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : 'Failed to fetch video Details.');
    }
  };

  /*
  To debug re-renders and fetchFirst needed while strict mode is being used
  */
  const fetchFirst = useRef(true);
  /**
   @param{string} [pageToken]- (Optional) Token for the infinite scroll
    *
    *Behavior:
    * - If loading is True prevents in calling a duplicate fetch
   **/
  const fetchVideos = async (pageToken?: string) => {
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video${pageToken ? `&pageToken=${pageToken}` : ''}&maxResults=${maxResult}`;

      const response = await axios.get(url);

      if (response.status === 200) {
        if (!response.data.items || response.data.items.length === 0) {
          return;
        }

        if (isInfiniteScroll && response.data.nextPageToken.length > 0) {
          const newPageToken = response.data.nextPageToken;
          setNextPageToken(newPageToken);
          cachedVideos.set<string>(cacheNextPageTokenKey, newPageToken);
        }

        const videoItems: Video[] = response.data.items;
        const videoIds: string[] = videoItems.map((video: Video) => video.id.videoId);

        const channelIds: string[] = [...new Set(videoItems.map((video: Video) => video.snippet.channelId))];

        const statisticsMap = await fetchVideoStatistics(videoIds);

        const channelMap = await fetchChannelDetails(channelIds);

        const newVideos = videoItems.map((video: Video) => ({
          ...video,
          statistics: statisticsMap[video.id.videoId],
          snippet: {
            ...video.snippet,
            channelTitle: channelMap[video.snippet.channelId]?.title,
            channelLogo: channelMap[video.snippet.channelId]?.logo,
            publishedAt: video.snippet.publishedAt,
          },
        }));

        setVideos((previousVideos) => (nextPageToken ? [...previousVideos, ...newVideos] : [...newVideos]));

        if (isInfiniteScroll) {
          cachedVideos.append<Video[]>(cacheVideosKey, newVideos);
        } else {
          cachedVideos.set<Video[]>(cacheVideosKey, newVideos);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreVideos = useCallback(() => {
    if (loading || videos.length > 50) return;

    const token = nextPageToken ? nextPageToken : cachedVideos.get<string>(cacheNextPageTokenKey);
    if (!token) return;
    fetchVideos(token);
  }, [loading, videos.length, nextPageToken]);

  /*
   * Behavior:
   * - Is called once in the application for all video sections in home page. If  theres
   * cached videos set the videos state to the data in cache
   * else make one fetch request
   */
  useEffect(() => {
    if (fetchFirst.current) {
      fetchFirst.current = false;
      const cached = cachedVideos.get<Video[]>(cacheVideosKey);
      if (cached && cached.length > 0) {
        setVideos(cached);
      } else {
        fetchVideos();
      }
    }
  }, []);

  useEffect(() => {
    if (nextPageToken) {
      cachedVideos.set<string>(cacheNextPageTokenKey, nextPageToken);
    }
  }, [nextPageToken]);

  return {
    videos,
    loading,
    error,
    loadMoreVideos,
    playVideo,
  };
}
