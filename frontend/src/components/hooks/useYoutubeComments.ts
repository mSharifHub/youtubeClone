import axios from 'axios';
import { useState } from 'react';

/**
 * Represents a snippet of information about a comment.
 */

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

/**
 * Represents the result of using YouTube comments functionality, including the list of comments,
 * loading state, error information, and functionality to fetch additional comments for a video.
 */
interface UseYouTubeCommentsResult {
  comments: CommentThread[];
  commentsLoading: boolean;
  commentsPageToken: string | null;
  topLevelCount: number;
  fetchComments: (videoId: string, pageToken?: string | null) => Promise<void>;
  hasMore: boolean;
  commentsError: string | null;
}

/**
 * A custom hook for fetching and managing YouTube comments for a specific video using the YouTube Data API.
 *
 * @param {string} apiKey - The YouTube Data API key required to authenticate requests.
 * @param{number} maxResults
 * @return {UseYouTubeCommentsResult} An object containing the current state of the comments, loading state, error state, a function to fetch comments, and a flag indicating if more comments are available.
 *
 */
export function useYoutubeComments(apiKey: string, maxResults: number): UseYouTubeCommentsResult {
  /**
   * Represents the user's comments in a system or application.
   * This variable stores the collection of comments made by a user.
   * It is used to display or process user-generated feedback or remarks.
   */
  const [comments, setComments] = useState<CommentThread[]>([]);
  const [topLevelCount, setTopLevelCount] = useState<number>(0);
  /**
   * A boolean variable indicating the loading state of comments.
   * If true, the application is currently loading comments.
   * If false, the comment loading process is complete or not initiated.
   */
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  /**
   * Represents an error related to the handling, processing, or validation of comments.
   */
  const [commentsError, setCommentsError] = useState<string | null>(null);
  /**
   * A token used for pagination in fetching comments.
   * Represents a pointer to the current page of comments and is used to fetch the next page of results.
   * Typically provided by APIs that paginate comment data.
   * The value of this token changes as the user navigates through pages.
   */
  const [commentsPageToken, setCommentsPageToken] = useState<string | null>(null);

  /**
   * Fetches and processes comment threads for a specific YouTube video using the YouTube Data API v3.
   *
   * @async
   * @function fetchComments
   * @param {string} videoId - The unique identifier of the YouTube video for which to retrieve comments.
   * @param {string} [pageToken] - An optional pagination token for fetching the next page of comments.
   * @returns {Promise<void>} A promise that resolves when the comment threads have been fetched and processed.
   *
   * This function retrieves comments using the provided video ID and stores the fetched comment threads
   * in a state variable. If a page token is provided, it fetches the corresponding page of comment threads
   * to facilitate pagination.
   *
   * Key function behaviors:
   * - Prevents multiple requests by checking if comments are already loading.
   * - Handles errors and sets an error state if an error occurs during fetching.
   * - Updates the pagination token to allow loading additional pages.
   * - Processes and maps raw comment thread data into a structured format for easier use.
   *
   * The comments include information such as:
   * - Top-level comment details (text, author, metadata, etc.).
   * - Replies and their associated metadata, if available.
   *
   * The function utilizes state updates to manage:
   * - The loading state (`setCommentsLoading`).
   * - Error information (`setCommentsError`).
   * - Fetched comment threads (`setComments`).
   * - The pagination token for subsequent requests (`setCommentsPageToken`).
   */
  const fetchComments = async (videoId: string, pageToken?: string | null): Promise<void> => {
    if (commentsLoading) return;

    setCommentsLoading(true);
    setCommentsError(null);

    try {
      /**
       * The URL used to fetch comment threads for a specific YouTube video using the YouTube Data API v3.
       * This URL includes the snippet and replies parts, the video ID, API key, and optionally max results
       * and a page token for pagination.
       *
       * Components:
       * - `part=snippet,replies`: Specifies the called parts of the API resource.
       * - `videoId`: Identifies the particular video for which comments are retrieved.
       * - `key`: The API key required for authenticating YouTube Data API requests.
       * - `maxResults`: Defines the maximum number of results to return in a single request.
       * - `pageToken`: (Optional) Token for fetching the next page of results.
       */
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
        const newThreads = fetchedCommentThreads.filter(
          (newThread) => !prevComments.some((thread) => thread.id === newThread.id),
        );
        const updatedTopLevelComments = [...prevComments, ...newThreads];
        setTopLevelCount(updatedTopLevelComments.length);
        return updatedTopLevelComments;
      });
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
    topLevelCount,
    fetchComments,
    hasMore: commentsPageToken !== null,
    commentsPageToken,
  };
}
