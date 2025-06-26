import axios from 'axios';
import { Video } from './youtubeVideoInterfaces.ts';

export const fetchVideo = async (videoId: string, apiKey: string) => {
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`;

    const response = await axios.get(url);

    if (!response.data.items || response.data.items.length === 0) {
      return;
    }
    return response.data.items[0] as Video;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'An error occurred while fetching video');
  }
};
