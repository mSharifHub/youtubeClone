import axios from 'axios';

export const fetchVideo = async (videoId: string, apiKey: string) => {
  try {
    const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`;

    const videoResponse = await axios.get(videoUrl);

    if (!videoResponse.data.items || videoResponse.data.items.length === 0) return;

    const item = videoResponse.data.items[0];

    const channelId = item.snippet?.channelId;

    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
    const channelResponse = await axios.get(channelUrl);

    const channelItem = channelResponse.data.items[0];

    const video = {
      id: { videoId: item.id },
      snippet: {
        title: item.snippet?.title,
        description: item.snippet?.description,
        thumbnails: item.snippet?.thumbnails,
        channelId: item.snippet?.channelId,
        channelTitle: item.snippet?.channelTitle,
        channelDescription: channelItem?.snippet?.description,
        channelLogo: channelItem?.snippet?.thumbnails?.default?.url,
        publishedAt: item.snippet?.publishedAt,
        subscriberCount: channelItem?.statistics?.subscriberCount,
        categoryId: item.snippet?.categoryId,
      },
      statistics: {
        viewCount: item.statistics.viewCount,
        likeCount: item.statistics.likeCount,
        dislikeCount: item.statistics.dislikeCount,
        commentCount: item.statistics.commentCount,
        duration: item.contentDetails?.duration,
        categoryId: item.snippet?.categoryId,
      },
      contentDetails: {
        duration: item.contentDetails.duration,
      },
    };

    if (video) return video;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'An error occurred while fetching video');
  }
};
