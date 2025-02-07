import { useCallback, useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const cachedVideos = LocalCache.getInstance();

  const cacheKey = `youtube_videos_${section}`;

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

  const fetchVideos = useCallback(
    async (pageToken?: string) => {
      if (!isInfiniteScroll && !pageToken) {
        const cacheData = cachedVideos.get<Video[]>(cacheKey);

        // if cache exist do not make a fetch call
        if (cacheData && cacheData.length > 0) {
          console.log(
            `[Cache] Loading videos for ${cacheKey} from local cache instance`,
          );
          setVideos(cacheData);
          return;
        }
      }

      if (loading) return;
      setLoading(true);
      setError(null);

      try {
        let url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&maxResults=${maxResult}`;

        if (pageToken) {
          url += `&pageToken=${pageToken}`;
        }

        const response = await axios.get(url);

        if (response.status === 200) {
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

          if (isInfiniteScroll) {
            setVideos((previousVideos) => {
              const updatedVideos = [...previousVideos, ...newVideos];
              cachedVideos.set<Video[]>(cacheKey, updatedVideos);
              return updatedVideos;
            });
          } else {
            setVideos(newVideos);
            cachedVideos.set<Video[]>(cacheKey, newVideos);
          }
          console.log(
            `[Debugging] next page token ${response.data.nextPageToken}`);
          setNextPageToken(response.data.nextPageToken || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : null);
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [loading, nextPageToken, isInfiniteScroll],
  );

  useEffect(() => {
    fetchVideos();
  }, []);

  function loadMoreVideos() {
    if (nextPageToken) {
      fetchVideos(nextPageToken);
    }
  }

  return {
    videos,
    loading,
    error,
    playVideo,
    selectedVideoId,
    loadMoreVideos,
  };
}
