import { useEffect, useState } from 'react';
import axios from 'axios';

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
}

export interface Video {
  id: {
    videoId: string;
  };
  snippet: VideoSnippet;
}

interface UseYoutubeVideosResult {
  videos: Video[];
  loading: boolean;
  error: string | null;
  playVideo: (videoId: string) => void;
  selectedVideoId: string | null;
}

export default function useYoutubeVideos(
  apiKey: string,
  maxResult: number,
): UseYoutubeVideosResult {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  function playVideo(videoId: string): void {
    setSelectedVideoId(videoId);
  }

  async function fetchVideos() {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&maxResults=${maxResult}`,
      );

      if (response.status === 200) {
        setVideos(response.data.items);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

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
