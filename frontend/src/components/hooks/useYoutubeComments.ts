import axios from 'axios';
import { useState } from 'react';

export interface CommentSnippet {
  authorDisplayName: string;
  authorProfileImageUrl: string;
  authorChannelUrl?: string;
  authorChannelId?: {
    value: string;
  };
  channelId: string;
  textDisplay: string;
  textOriginal: string;
  parentId?: string;
  canRate: boolean;
  viewerRating: string;
  likeCount: number;
  moderationStatus?: string;
  publishedAt: string;
  updatedAt: string;
}

interface CommentThread {
  id: string;
  snippet: {
    videoId: string;
    topLevelComment: {
      id: string;
      snippet: CommentSnippet;
    };
    canReply: boolean;
    totalReplyCount: number;
    isPublic: boolean;
  };
  replies?: {
    comments: CommentSnippet[];
  };
}

interface UseYouTubeCommentsResult {
  comments: CommentThread[];
  commentsLoading: boolean;
  commentsError: string | null;
}

export function useYoutubeComments(apiKey: string): UseYouTubeCommentsResult {
  const [comments, setComments] = useState<CommentThread[]>([]);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [commentsPageToken, setCommentsPageToken] = useState<string | null>(null);

  const fetchComments = async (apiKey: string, videoId: string, maxResults: number = 10, pageToken?: string): Promise<void> => {
    if (commentsLoading) return;

    setCommentsLoading(true);
    setCommentsError(null);

    try {
      const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&key=${apiKey}&maxResults=${maxResults}${pageToken ? `&pageToken=${pageToken}` : ''}`;

      const response = await axios.get(url);

      if (!response.data.items || response.data.items.length === 0) return;

      const data = response.data;

      const fetchedCommentThreads: CommentThread[] = data.items.map((item: any) => ({
        id: item.id,
        snippet: {
          videoId: item.snippet.videoId,
          topLevelComment: {
            id: item.snippet.topLevelComment.id,
            snippet: {
              ...item.snippet.topLevelComment.snippet,
            },
          },
          canReply: item.snippet.canReply,
          totalReplyCount: item.snippet.totalReplyCount,
          isPublic: item.snippet.isPublic,
        },
        replies: item.replies
          ? {
              comments: item.replies.comments.map((reply: any) => ({
                ...reply.snippet,
              })),
            }
          : undefined,
      }));

      setComments((prevComments) => [...prevComments, ...fetchedCommentThreads]);

      setCommentsPageToken(data.nextPageToken || null);
    } catch (err) {
      setCommentsError(err instanceof Error ? err.message : 'An error occurred fetching comments threads');
    } finally {
      setCommentsLoading(false);
    }
  };

  return {
    comments,
    commentsLoading,
    commentsError,
  };
}
