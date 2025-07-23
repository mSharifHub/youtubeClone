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

    const { items } = response.data;

    const channelMap = items.reduce((map, item) => {
      const channelId = item.id || '';
      const channelTitle = item.snippet?.title || '';
      const channelLogo = item.snippet.thumbnails?.default?.url || '';
      const subscriberCount = item.statistics?.subscriberCount || '0';
      const channelDescription = item.snippet?.description || '';

      map[channelId] = {
        channelId,
        channelTitle,
        logo: channelLogo,
        subscriberCount,
        channelDescription,
      };

      return map;
    }, {});

    return channelMap;
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Failed to fetch video Details.');
  }
};
