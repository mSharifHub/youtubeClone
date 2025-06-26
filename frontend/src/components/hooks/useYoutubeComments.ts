import axios from 'axios';
import { RefObject, useCallback, useEffect, useState } from 'react';
import { useSelectedVideo } from '../../contexts/selectedVideoContext/SelectedVideoContext.ts';
import { useIntersectionObserver } from './useIntersectionObserver.ts';

export interface CommentSnippet {
  authorDisplayName: string;
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

export interface CommentThread {
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

interface useYoutubeComments {
  comments: CommentThread[] | [];
  commentsLoading: boolean;
  commentsError: string | null;
  commentsPageToken: string | null;
  topLevelCount: number;
  sentinelRef: RefObject<HTMLDivElement>;
}

export function useYoutubeComments(apiKey: string, maxResults: number): useYoutubeComments {
  const [comments, setComments] = useState<CommentThread[]>([]);
  const [topLevelCount, setTopLevelCount] = useState<number>(0);

  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);

  const [commentsError, setCommentsError] = useState<string | null>(null);

  const [commentsPageToken, setCommentsPageToken] = useState<string | null>(null);

  const { selectedVideo } = useSelectedVideo();

  const MAX_LIMIT = 50;

  const fetchComments = useCallback(
    async (videoId: string, pageToken?: string | null): Promise<void> => {
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
                authorDisplayName: item.snippet.topLevelComment.snippet.authorDisplayName,
                authorChannelUrl: item.snippet.topLevelComment.snippet.authorChannelUrl,
                authorChannelId: item.snippet.topLevelComment.snippet.authorChannelId,
                channelId: item.snippet.topLevelComment.snippet.channelId,
                textDisplay: item.snippet.topLevelComment.snippet.textDisplay,
                textOriginal: item.snippet.topLevelComment.snippet.textOriginal,
                parentId: item.snippet.topLevelComment.snippet.parentId,
                canRate: item.snippet.topLevelComment.snippet.canRate,
                viewerRating: item.snippet.topLevelComment.snippet.viewerRating,
                likeCount: item.snippet.topLevelComment.snippet.likeCount,
                publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
                updatedAt: item.snippet.topLevelComment.snippet.updatedAt,
              },
            },
            canReply: item.snippet.canReply,
            totalReplyCount: item.snippet.totalReplyCount,
            isPublic: item.snippet.isPublic,
          },
          replies: item.replies
            ? {
                comments: item.replies.comments.map((reply: any) => ({
                  authorDisplayName: reply.snippet.authorDisplayName,
                  authorChannelUrl: reply.snippet.authorChannelUrl,
                  authorChannelId: reply.snippet.authorChannelId,
                  channelId: reply.snippet.channelId,
                  textDisplay: reply.snippet.textDisplay,
                  textOriginal: reply.snippet.textOriginal,
                  parentId: reply.snippet.parentId,
                  canRate: reply.snippet.canRate,
                  viewerRating: reply.snippet.viewerRating,
                  likeCount: reply.snippet.likeCount,
                })),
              }
            : undefined,
        }));

        setComments((prevComments) => {
          const newThreads = fetchedCommentThreads.filter((newThread) => !prevComments.some((thread) => thread.id === newThread.id));
          const updatedTopLevelComments = [...prevComments, ...newThreads];
          setTopLevelCount(updatedTopLevelComments.length);
          return updatedTopLevelComments;
        });
        setCommentsPageToken(data.nextPageToken ?? null);
      } catch (err) {
        setCommentsError(err instanceof Error ? err.message : '');
        throw new Error(err instanceof Error ? err.message : 'An error occurred fetching comments threads');
      } finally {
        setCommentsLoading(false);
      }
    },
    [apiKey],
  );

  const loadMoreComments = async () => {
    if (!commentsPageToken || !selectedVideo) return;
    await fetchComments(selectedVideo.id.videoId, commentsPageToken);
  };

  const resetComments = () => {
    setComments([]);
    setTopLevelCount(0);
    setCommentsPageToken(null);
    setCommentsError(null);
  };

  const sentinelRef = useIntersectionObserver(loadMoreComments, commentsLoading, topLevelCount, MAX_LIMIT);

  useEffect(() => {
    if (!selectedVideo) return;
    const load = async () => {
      resetComments();
      try {
        if (selectedVideo.id.videoId) await fetchComments(selectedVideo?.id.videoId);
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : 'An error occurred fetching comments threads');
      }
    };
    load();
  }, [selectedVideo]);

  return {
    comments,
    topLevelCount,
    commentsLoading,
    commentsError,
    commentsPageToken,
    sentinelRef,
  };
}
