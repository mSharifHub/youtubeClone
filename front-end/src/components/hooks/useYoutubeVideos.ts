import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import LocalCache from '../../apiCache/LocalCache.ts';

/*
 * Check YouTube Documentation for the properties
 *
 */
export interface VideoSnippet {
  title: string;
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

export interface Video {
  id: {
    videoId: string;
  };
  snippet: VideoSnippet;
  statistics?: VideoStatistics;
}

interface UseYoutubeVideosResult {
  videos: Video[];
  loading: boolean | null;
  error: string | null;
  playVideo: (videoId: string) => void;
  selectedVideoId: string | null;
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
  async function fetchVideoStatistics(videoIds: string[]) {
    try {
      const idsString = videoIds.join(',');

      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${idsString}&part=statistics,contentDetails`,
      );

      const statsMap = response.data.items.reduce(
        (map, item) => {
          map[item.id] = {
            viewCount: item.statistics.viewCount,
            likeCount: item.statistics.likeCount,
            duration: item.contentDetails.duration,
          };
          return map;
        },
        {} as Record<string, VideoStatistics>,
      );

      return statsMap;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  /*
   fetch additional video details
   */
  async function fetchChannelDetails(channelIds: string[]) {
    try {
      const idsString = channelIds.join(',');
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${idsString}&part=snippet`,
      );

      const channelMap = response.data.items.reduce((map, item) => {
        map[item.id] = {
          title: item.snippet.title,
          logo: item.snippet.thumbnails.default?.url,
        };
        return map;
      }, {});

      return channelMap;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  // [Debug] number of re-renders
  const fetchVideosCallref = useRef(0);
  const fetchVideos = useCallback(
    async (pageToken?: string) => {
      fetchVideosCallref.current++;
      console.log(
        `fetchVideos has been called ${fetchVideosCallref.current} times`,
      );

      if (loading) return;
      setLoading(true);
      setError(null);

      try {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video${pageToken ? `&pageToken=${pageToken}` : ''}&maxResults=${maxResult}`;

        const response = await axios.get(url);

        if (response.status === 200) {
          const newPageToken = response.data.nextPageToken || null;
          setNextPageToken(newPageToken);
          cachedVideos.set<string>(cacheNextPageTokenKey, newPageToken);

          const videoItems = response.data.items;
          const videoIds = videoItems.map((video: Video) => video.id.videoId);

          const channelIds: string[] = [
            ...new Set(
              videoItems.map(
                (video: Video) => video.snippet.channelId,
              ) as string,
            ),
          ];

          const statisticsMap = await fetchVideoStatistics(videoIds);

          const channelMap = await fetchChannelDetails(channelIds);

          const newVideos = videoItems.map((video: Video) => ({
            ...video,
            statistics: statisticsMap[video.id.videoId],
            snippet: {
              ...video.snippet,
              channelTitle: channelMap[video.snippet.channelId].title,
              channelLogo: channelMap[video.snippet.channelId].logo,
              publishedAt: video.snippet.publishedAt,
            },
          }));

          // setVideos((previousVideos) =>  [...previousVideos, ...newVideos]);

          setVideos((previousVideos) =>
            nextPageToken ? [...previousVideos, ...newVideos] : [...newVideos],
          );

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
    },
    [loading, nextPageToken],
  );

  const loadMoreVideos = () => {
    const token = nextPageToken
      ? nextPageToken
      : cachedVideos.get<string>(cacheNextPageTokenKey);

    if (token) {
      console.log(`[useYoutubeVideos] load more called nextPageToken ${token}`);
      fetchVideos(token);
    }
  };

  useEffect(() => {
    if (nextPageToken) {
      cachedVideos.set<string>(cacheNextPageTokenKey, nextPageToken);
    }
  }, [nextPageToken]);

  // when  component mount for the first load
  useEffect(() => {
    const cached = cachedVideos.get<Video[]>(cacheVideosKey);
    if (cached && cached.length > 0) {
      console.log(`[useYoutubeVideos]  loaded from cached`);
      setVideos(cached);
    } else {
      console.log(`[useYoutubeVideos] loaded from API call`);
      fetchVideos();
    }
  }, []);

  return {
    videos,
    loadMoreVideos,
    loading,
    error,
    playVideo,
    selectedVideoId,
  };
}
