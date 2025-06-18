import axios from 'axios';

const apiKey: string = import.meta.env.VITE_YOUTUBE_API_3;

export const fetchChannelDetails = async (channelIds: string[]) => {
  try {
    const idsString = channelIds.join(',');
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${idsString}&part=snippet,statistics`);

    if (!response.data.items || response.data.items.length === 0) {
      console.warn('No video details found for the given video ids');
      return {};
    }

    return response.data.items.reduce(
      (
        map: Record<
          string,
          {
            channelId: string;
            channelTitle?: string;
            logo?: string;
            subscriberCount?: string;
            channelDescription?: string;
          }
        >,
        item,
      ) => {
        map[item.id] = {
          channelId: item.id || '',
          channelTitle: item.snippet?.title || '',
          logo: item.snippet.thumbnails?.default?.url || '',
          subscriberCount: item.statistics?.subscriberCount || '0',
          channelDescription: item.snippet?.description || '',
        };
        return map;
      },
      {},
    );
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Failed to fetch video Details.');
  }
};
