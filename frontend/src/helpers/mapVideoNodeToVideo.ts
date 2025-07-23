import { VideoNode } from '../graphql/types.ts';
import { Video } from '../types/youtubeVideoInterfaces.ts';

export const mapVideoNodeToVideo = (videoNode: VideoNode): Video => {
  return {
    id: { videoId: videoNode.videoId },
    snippet: {
      title: videoNode.title ?? '',
      description: videoNode.description ?? '',
      channelId: videoNode.channelId ?? '',
      channelLogo: videoNode.channelLogo ?? '',
      channelTitle: videoNode.channelTitle ?? '',
      channelDescription: videoNode.channelDescription ?? '',
      publishedAt: videoNode.publishedAt ?? '',
      subscriberCount: videoNode.subscriberCount?.toString() ?? '',
      categoryId: videoNode.categoryId ?? '',
      thumbnails: {
        default: videoNode.thumbnailDefault ? { url: videoNode.thumbnailDefault } : undefined,
        medium: videoNode.thumbnailMedium ? { url: videoNode.thumbnailMedium } : undefined,
        high: undefined,
      },
    },
    statistics: {
      viewCount: videoNode.viewCount ? videoNode.viewCount.toString() : '',
      likeCount: videoNode.likeCount ? videoNode.likeCount.toString() : '',
      dislikeCount: undefined,
      commentCount: videoNode.commentCount ? videoNode.commentCount.toString() : '',
      duration: videoNode.duration ? videoNode.duration.toString() : '',
    },
  };
};
