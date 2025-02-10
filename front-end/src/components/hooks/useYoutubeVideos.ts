import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import LocalCache from '../../apiCache/LocalCache.ts';

export interface ChannelDetails {
  channelId: string;
  title: string;
  logo?: string;
}

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
  publishedAt: string;
  channel: ChannelDetails;
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

      return response.data.items.reduce(
        (map: Record<string, VideoStatistics>, item) => {
          map[item.id] = {
            viewCount: item.statistics?.viewCount || '0',
            likeCount: item.statistics?.likeCount || '0',
            duration: item.contentDetails?.duration || '0',
          };
          return map;
        },
        {},
      );
    } catch (e) {
      throw new Error(
        e instanceof Error ? e.message : 'Failed to fetch video statistics.',
      );
    }
  }

  /*Fetch additional video details*/
  async function fetchChannelDetails(channelIds: string[]) {
    try {
      const idsString = channelIds.join(',');
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${idsString}&part=snippet`,
      );

      return response.data.items.reduce(
        (map: Record<string, ChannelDetails>, item) => {
          map[item.id] = {
            channelId: item.id,
            title: item.snippet.title,
            logo: item.snippet.thumbnails?.default?.url,
          };
          return map;
        },
        {},
      );
    } catch (e) {
      throw new Error(
        e instanceof Error ? e.message : 'Failed to fetch video Details.',
      );
    }
  }

  //[Debug] number of re-renders
  const fetchRef = useRef(0);
  const loadMoreRef = useRef(0);

  const fetchVideos = useCallback(
    async (pageToken?: string) => {
      // if loading return
      if (loading) {
        console.log('[useYoutube] Loading..., returning function fetch');
        return;
      }

      //Counting number of times this function is called
      fetchRef.current++;
      console.log(
        `%c[useYoutubeVideos] fetchVideos called ${fetchRef.current} times (section: ${section})`,
        'color: blue; font-weight: bold;',
      );

      setLoading(true);
      setError(null);

      try {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video${pageToken ? `&pageToken=${pageToken}` : ''}&maxResults=${maxResult}`;

        const response = await axios.get(url);

        if (response.status === 200) {
          if (isInfiniteScroll) {
            const newPageToken = response.data.nextPageToken || null;
            console.log(
              `[useYoutubeVideos] New pageToken received: ${newPageToken} (section: ${section})`,
            );

            setNextPageToken(newPageToken);
            cachedVideos.set<string>(cacheNextPageTokenKey, newPageToken);
          }

          const videoItems: Video[] = response.data.items;
          const videoIds: string[] = videoItems.map(
            (video: Video) => video.id.videoId,
          );

          const channelIds: string[] = [
            ...new Set(
              videoItems.map((video: Video) => video.snippet.channel.channelId),
            ),
          ];

          const statisticsMap = await fetchVideoStatistics(videoIds);

          const channelMap = await fetchChannelDetails(channelIds);

          const newVideos = videoItems.map((video: Video) => ({
            ...video,
            statistics: statisticsMap[video.id.videoId],
            snippet: {
              ...video.snippet,
              channel: {
                channelId: video.snippet.channel.channelId,
                title: channelMap[video.snippet.channel.channelId].title,
                logo: channelMap[video.snippet.channel.channelId]?.logo,
              },
              publishedAt: video.snippet.publishedAt,
            },
          }));

          setVideos((previousVideos) =>
            nextPageToken ? [...previousVideos, ...newVideos] : [...newVideos],
          );

          cachedVideos.append<Video[]>(cacheVideosKey, newVideos);
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
    loadMoreRef.current++;
    console.log(
      `%c[useYoutubeVideos] loadMoreVideos called ${loadMoreRef.current} times (section: ${section})`,
      'color: orange; font-weight: bold;',
    );
    const token = nextPageToken
      ? nextPageToken
      : cachedVideos.get<string>(cacheNextPageTokenKey);

    if (token) {
      console.log(
        `[useYoutubeVideos] Loading more videos with token: ${token} (section: ${section})`,
      );
      fetchVideos(token);
    }
  };

  useEffect(() => {
    if (nextPageToken) {
      console.log(
        `[useYoutubeVideos] Storing nextPageToken in cache: ${nextPageToken} (section: ${section})`,
      );
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
  };
}
