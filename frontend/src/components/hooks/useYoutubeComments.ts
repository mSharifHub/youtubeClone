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

/**
 * Represents a thread of comments on a video. A comment thread includes the
 * top-level comment and associated replies, if any.
 *
 * @interface CommentThread
 *
 * @property {string} id
 *   The unique identifier for the comment thread.
 *
 * @property {Object} snippet
 *   Contains metadata about the comment thread, including the top-level comment
 *   and other attributes.
 *
 * @property {string} snippet.videoId
 *   The unique identifier of the video on which this comment thread is posted.
 *
 * @property {Object} snippet.topLevelComment
 *   Details about the top-level comment in the thread.
 *
 * @property {string} snippet.topLevelComment.id
 *   The unique identifier for the top-level comment.
 *
 * @property {CommentSnippet} snippet.topLevelComment.snippet
 *   Details about the content and attributes of the top-level comment.
 *
 * @property {boolean} snippet.canReply
 *   Indicates whether replies can be added to this comment thread.
 *
 * @property {number} snippet.totalReplyCount
 *   The total number of replies to the top-level comment.
 *
 * @property {boolean} snippet.isPublic
 *   Indicates whether the comment thread is publicly visible.
 *
 * @property {Object} [replies]
 *   Contains the replies to the top-level comment, if any.
 *
 * @property {CommentSnippet[]} [replies.comments]
 *   An array of comment details for all replies associated with the top-level
 *   comment.
 */
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
  fetchComments: (apiKey: string, videoId: string, maxResults?: number, pageToken?: string) => Promise<void>;
  hasMore: boolean;
  commentsError: string | null;
}

/**
 * A custom hook for fetching and managing YouTube comments for a specific video using the YouTube Data API.
 *
 * @param {string} apiKey - The YouTube Data API key required to authenticate requests.
 * @return {UseYouTubeCommentsResult} An object containing the current state of the comments, loading state, error state,
 *                                    a function to fetch comments, and a flag indicating if more comments are available.
 */
export function useYoutubeComments(apiKey: string): UseYouTubeCommentsResult {
  /**
   * Represents the user's comments in a system or application.
   * This variable stores the collection of comments made by a user.
   * It is used to display or process user-generated feedback or remarks.
   */
  const [comments, setComments] = useState<CommentThread[]>([]);
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
   * Fetches comments for a specified YouTube video using the YouTube Data API.
   * This function retrieves a list of comment threads associated with the given video ID
   * and updates the application state with the fetched data.
   * Handles pagination using an optional pageToken parameter and includes error handling.
   *
   * @param {string} apiKey - The API key required to authenticate with the YouTube Data API.
   * @param {string} videoId - The ID of the YouTube video for which to fetch comments.
   * @param {number} [maxResults=10] - The maximum number of comment threads to retrieve per API call. Defaults to 10.
   * @param {string} [pageToken] - The token for the next page of results, used for pagination.
   * @returns {Promise<void>} A promise representing the asynchronous operation to fetch comments.
   */
  const fetchComments = async (apiKey: string, videoId: string, maxResults: number = 10, pageToken?: string): Promise<void> => {
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

      /**
       * An array of comment threads fetched and mapped from the data source.
       *
       * Each comment thread contains details about a top-level comment and its replies (if any),
       * along with associated metadata.
       *
       * @type {CommentThread[]}
       *
       * Structure:
       * - `id`: The unique ID of the comment thread.
       * - `snippet`:
       *    - `videoId`: The ID of the video the comment thread belongs to.
       *    - `topLevelComment`:
       *       - `id`: The unique ID of the top-level comment.
       *       - `snippet`: Metadata associated with the top-level comment including:
       *         - `authorDisplayName`: The display name of the author.
       *         - `authorProfileImageUrl`: The URL of the author's profile image.
       *         - `authorChannelUrl`: The URL of the author's channel.
       *         - `authorChannelId`: The ID of the author's channel.
       *         - `channelId`: The ID of the channel the comment is associated with.
       *         - `textDisplay`: The displayed text of the comment.
       *         - `textOriginal`: The original text of the comment.
       *         - `parentId`: The ID of the comment’s parent (if applicable).
       *         - `canRate`: Indicates whether the comment can be rated (liked/disliked).
       *         - `viewerRating`: The rating given by the current viewer ("none", "like", "dislike").
       *         - `updated`: The last updated timestamp of the comment.
       *    - `canReply`: Indicates whether replies are allowed for the top-level comment.
       *    - `totalReplyCount`: The total number of replies to the top-level comment.
       *    - `isPublic`: Indicates whether the comment thread is publicly visible.
       * - `replies` (optional):
       *    - `comments`: An array of replies to the top-level comment, each containing:
       *       - `authorDisplayName`: The display name of the reply author.
       *       - `authorProfileImageUrl`: The URL of the reply author's profile image.
       *       - `authorChannelUrl`: The URL of the reply author's channel.
       *       - `authorChannelId`: The ID of the reply author's channel.
       *       - `channelId`: The ID of the channel the reply is associated with.
       *       - `textDisplay`: The displayed text of the reply.
       *       - `textOriginal`: The original text of the reply.
       *       - `parentId`: The ID of the parent comment (top-level comment).
       *       - `canRate`: Indicates whether the reply can be rated (liked/disliked).
       *       - `viewerRating`: The rating given by the current viewer ("none", "like", "dislike").
       */
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
              updated: item.snippet.topLevelComment.snippet.updated,
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
    fetchComments,
    hasMore: commentsPageToken !== null,
  };
}
