import { DocumentNode, gql } from '@apollo/client';

export const VIEWER_QUERY: DocumentNode = gql`
  query Viewer {
    viewer {
      firstName
      lastName
      username
      youtubeHandler
      email
      profilePicture
      bio
      subscribers {
        username
        email
      }
    }
  }
`;
export const VIEWER_POSTS_QUERY: DocumentNode = gql`
  query ViewerPosts($first: Int, $after: String) {
    viewerPosts(first: $first, after: $after) {
      edges {
        node {
          id
          content
          createdAt
          profilePicture
          author {
            youtubeHandler
          }
          images {
            image
          }
        }
        cursor
      }
      pageInfo {
        endCursor
        startCursor
        hasNextPage
      }
    }
  }
`;

export const YOUTUBE_VIDEO_CATEGORIES: DocumentNode = gql`
  query YoutubeVideoCategories($categoryId: String!, $pageToken: String, $maxResults: Int) {
    youtubeVideoCategories(categoryId: $categoryId, pageToken: $pageToken, maxResults: $maxResults) {
      nextPageToken
      hasNextPage
      totalResults
      videos {
        id
        videoId
        title
        description
        thumbnailsDefault
        thumbnailsMedium
        thumbnailsHigh
        channelId
        channelTitle
        channelDescription
        channelLogo
        publishedAt
        subscriberCount
        categoryId
        viewCount
        likeCount
        commentCount
        duration
      }
    }
  }
`;

export const YOUTUBE_SEARCH_VIDEOS: DocumentNode = gql`
  query YoutubeSearchVideos($query: String, $pageToken: String, $maxResults: Int) {
    youtubeSearchVideos(query: $query, pageToken: $pageToken, maxResults: $maxResults) {
      nextPageToken
      hasNextPage
      videos {
        id
        videoId
        title
        description
        thumbnailsDefault
        thumbnailsMedium
        thumbnailsHigh
        channelId
        channelTitle
        channelDescription
        channelLogo
        publishedAt
        subscriberCount
        categoryId
        viewCount
        likeCount
        commentCount
        duration
      }
    }
  }
`;

export const VIEWER_VIDEO_PLAYLIST: DocumentNode = gql`
  query ViewerVideoPlayList($first: Int, $after: String, $watcheAt_Gt: DateTime, $watchedAt_Lt: DateTime, $orderBy: String) {
    viewerVideoPlaylist {
      videoEntries(first: $first, after: $after, watchedAt_Gt: $watcheAt_Gt, watchedAt_Lt: $watchedAt_Lt, orderBy: $orderBy) {
        edges {
          node {
            video {
              videoId
              title
              description
              thumbnailsDefault
              thumbnailsMedium
              channelId
              channelTitle
              channelDescription
              channelLogo
              publishedAt
              subscriberCount
              categoryId
              viewCount
              likeCount
              commentCount
              duration
            }
            watchedAt
          }
        }
        pageInfo {
          endCursor
          startCursor
          hasNextPage
        }
      }
    }
  }
`;

export const GET_YOUTUBE_LIKED_VIDEOS: DocumentNode = gql`
  query YoutubeLikedVideos($pageToken: String, $maxResults: Int) {
    youtubeLikedVideos(pageToken: $pageToken, maxResults: $maxResults) {
      videos {
        id
        videoId
        title
        description
        thumbnailsDefault
        thumbnailsMedium
        thumbnailsHigh
        channelId
        channelTitle
        channelDescription
        channelLogo
        publishedAt
        subscriberCount
        categoryId
        viewCount
        likeCount
        commentCount
        duration
      }
      nextPageToken
      totalResults
      hasNextPage
    }
  }
`;

export const VIDEO_COMMENTS: DocumentNode = gql`
  query VideoComments($videoId: String!, $pageToken: String, $maxResults: Int) {
    youtubeVideoComments(videoId: $videoId, pageToken: $pageToken, maxResults: $maxResults) {
      commentsThreads {
        id
        threadId
        canReply
        totalReplyCount
        isPublic

        topLevelComment {
          commentId
          authorDisplayName
          authorChannelUrl
          authorChannelId
          textDisplay
          textOriginal
          likeCount
          publishedAt
          updatedAt
          parentId

          replies {
            commentId
            authorDisplayName
            textDisplay
            likeCount
            publishedAt
            parentId
          }
        }
        replies {
          commentId
          authorDisplayName
          textDisplay
          likeCount
          publishedAt
          parentId

          replies {
            commentId
            authorDisplayName
            textDisplay
            likeCount
            publishedAt
            parentId
          }
        }
        video {
          videoId
          title
          channelTitle
        }
      }
      nextPageToken
      totalResults
      hasNextPage
    }
  }
`;
