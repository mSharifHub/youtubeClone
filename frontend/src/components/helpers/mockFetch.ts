import { Video } from './youtubeVideoInterfaces';

let dummyCounter = 0;


export const mockFetchYoutubeData = async ({maxResult}:{maxResult:number}): Promise<{
  items: Video[];
  nextPageToken: string;
}> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const items: Video[] = Array.from({ length: maxResult }, (_, index) => {
    const id = `video-${dummyCounter++}`;
    return {
      id: { videoId: id },
      snippet: {
        title: `Dummy Video ${id}`,
        description: 'This is a test video description.',
        channelId: 'channel-123',
        channelTitle: 'Test Channel',
        publishedAt: new Date().toISOString(),
        thumbnails: {
          default: { url: '', width: 120, height: 90 },
          medium: { url: '', width: 320, height: 180 },
          high: { url: '', width: 480, height: 360 },
        },
        channelLogo: '',
        subscriberCount: '1000',
        channelDescription: 'Test channel description',
        categoryId: '10',
      },
      statistics: {
        viewCount: '10000',
        likeCount: '500',
        dislikeCount: '10',
        commentCount: '50',
        duration: 'PT5M32S',
      },
    };
  });

  return {
    items,
    nextPageToken: `token-${dummyCounter}`,
  };
};
