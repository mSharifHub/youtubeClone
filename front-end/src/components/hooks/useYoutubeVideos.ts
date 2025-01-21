import { useEffect, useState } from 'react';
import axios from 'axios';
import LocalCache from '../../apiCache/LocalCache.ts';
import CryptoJS from 'crypto-js';

const cache = LocalCache.getInstance();

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
}

export default function useYoutubeVideos(
  apiKey: string,
  maxResult: number,
  section: string,
): UseYoutubeVideosResult {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const cacheKey = `videos_${section}_${maxResult}`;

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

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);

    // Handle  pulling from local cache before making an api request to the end point
    try {
      // Retrieving cached videos
      const encryptedCacheVideos = cache.get<string>(cacheKey);

      if (encryptedCacheVideos) {
        console.log(`[Cache] found cache videos for key: ${cacheKey}`);

        // Decrypt the data
        const bytes = CryptoJS.AES.decrypt(
          encryptedCacheVideos,
          import.meta.env.VITE_BASIC_16_KEY_VIDEO_METADATA,
        );

        // Parsing decrypted data
        const decryptData = bytes.toString(CryptoJS.enc.Utf8);
        const videosMetaData: Video[] = JSON.parse(decryptData);

        setVideos(videosMetaData);
        setLoading(false);
        return;
      } else {
        console.log(`[Cache] no valid cache found for key ${cacheKey}`);
        cache.remove(cacheKey);
      }

      // If no videos in local cache then proceed with making an api GET request to the end point
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&maxResults=${maxResult}`,
      );

      if (response.status === 200) {
        const videoItems = response.data.items;

        const videoIds = videoItems.map((video: Video) => video.id.videoId);

        const channelIds: string[] = [
          ...new Set(
            videoItems.map((video: Video) => video.snippet.channelId) as string,
          ),
        ];

        const statisticsMap = await fetchVideoStatistics(videoIds);
        const channelMap = await fetchChannelDetails(channelIds);

        const videosWithDetails = videoItems.map((video: Video) => ({
          ...video,
          statistics: statisticsMap[video.id.videoId],
          snippet: {
            ...video.snippet,
            channelTitle: channelMap[video.snippet.channelId].title,
            channelLogo: channelMap[video.snippet.channelId].logo,
            publishedAt: video.snippet.publishedAt,
          },
        }));

        setVideos(videosWithDetails);

        const encryptedVideos = CryptoJS.AES.encrypt(
          JSON.stringify(videosWithDetails),
          import.meta.env.VITE_BASIC_16_KEY_VIDEO_METADATA,
        ).toString();

        cache.set<string>(cacheKey, encryptedVideos);
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return {
    videos,
    loading,
    error,
    playVideo,
    selectedVideoId,
  };
}
