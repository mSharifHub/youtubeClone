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
  categoryId?: string;
}

export interface VideoId {
  videoId: string;
}

export interface VideoContentDetails {
  duration: string;
}

export interface Video {
  id: VideoId;
  snippet: VideoSnippet;
  statistics?: VideoStatistics;
  contentDetails?: VideoContentDetails;
}

export interface UseinfiniteScrollOptions {
  root?: HTMLElement | null;
  rootMargin?: string;
  threshold?: number;
  enabled?: boolean;

}
