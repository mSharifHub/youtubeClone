import axios from 'axios';
import { VideoStatistics } from '../components/hooks/useYoutubeVideos.ts';

const apiKey: string = import.meta.env.VITE_YOUTUBE_API_3;

export const fetchVideoStatistics = async (videoIds: string[]) => {
  try {
    const idsString = videoIds.join(',');

    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${idsString}&part=snippet,statistics,contentDetails`);

    if (!response.data.items || response.data.items.length === 0) {
      console.warn('No video statistics found for the given video ids');
      return {};
    }

    return response.data.items.reduce((map: Record<string, VideoStatistics>, item) => {
      map[item.id] = {
        viewCount: item.statistics?.viewCount || '0',
        likeCount: item.statistics?.likeCount || '0',
        dislikeCount: item.statistics?.dislikeCount || '0',
        commentCount: item.statistics?.commentCount || '0',
        duration: item.contentDetails?.duration || 'PT0S',
        categoryId: item.snippet?.categoryId || '',
      };
      return map;
    }, {});
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Failed to fetch video statistics.');
  }
};
