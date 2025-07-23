export interface VideoSnippet {
  title?: string;
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
  channelDescription: string;
  channelLogo?: string;
  publishedAt: string;
  subscriberCount?: string;
  categoryId: string;
}

export interface VideoStatistics {
  viewCount: string;
  likeCount?: string;
  dislikeCount?: string;
  commentCount: string;
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

export interface InfiniteScrollOptions {
  root?: HTMLElement | null;
  rootMargin?: string;
  threshold?: number;
  enabled?: boolean;
}
