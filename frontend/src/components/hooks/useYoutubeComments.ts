import axios from 'axios';
import { useEffect, useState } from 'react';
import { UseinfiniteScrollOptions } from '../helpers/youtubeVideoInterfaces.ts';
import { useUser } from '../../contexts/userContext/UserContext.tsx';
import { useSelectedVideo } from '../../contexts/selectedVideoContext/SelectedVideoContext.ts';

export interface CommentSnippet {
  authorDisplayName: string;
  authorProfileImageUrl?: string;
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
}

export function useYoutubeComments(apiKey: string, maxResults: number, sentinelRef?: React.RefObject<Element>, options?: UseinfiniteScrollOptions): useYoutubeComments {
  const [comments, setComments] = useState<CommentThread[]>([]);
  const [topLevelCount, setTopLevelCount] = useState<number>(0);

  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);

  const [commentsError, setCommentsError] = useState<string | null>(null);

  const [commentsPageToken, setCommentsPageToken] = useState<string | null>(null);

  const {
    state: { isLoggedIn },
  } = useUser();

  const { selectedVideo } = useSelectedVideo();

  const fetchComments = async (videoId: string, pageToken?: string | null): Promise<void> => {
    if (commentsLoading || topLevelCount >= 50) return;

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
              authorProfileImageUrl: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
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
                authorProfileImageUrl: reply.snippet.authorProfileImageUrl,
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
      setCommentsError(err instanceof Error ? err.message : 'An error occurred fetching comments threads');
    } finally {
      setCommentsLoading(false);
    }
  };

  const resetComments = () => {
    setComments([]);
    setTopLevelCount(0);
    setCommentsPageToken(null);
    setCommentsError(null);
  };

  useEffect(() => {
    if (!selectedVideo && !selectedVideo.id.videoId) return;

    resetComments();
    fetchComments(selectedVideo.id.videoId);
  }, [selectedVideo?.id.videoId]);

  useEffect(() => {
    if (!sentinelRef?.current) return;

    const node = sentinelRef.current;

    if (!node || !selectedVideo || !commentsPageToken || commentsLoading || !isLoggedIn) return;

    let observer: IntersectionObserver | null = null;

    const handleIntersect = async ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting) {
        observer?.unobserve(node);
        await fetchComments(selectedVideo.id.videoId, commentsPageToken);
        observer?.observe(node);
      }
    };

    observer = new IntersectionObserver(handleIntersect, {
      root: options ? options.root : null,
      rootMargin: options ? options.rootMargin : '',
      threshold: options ? options.threshold : 0,
    });

    observer.observe(node);

    return () => {
      observer?.disconnect();
    };
  }, [commentsPageToken, isLoggedIn, selectedVideo.id.videoId, sentinelRef]);

  return {
    comments,
    commentsLoading,
    commentsError,
  };
}
