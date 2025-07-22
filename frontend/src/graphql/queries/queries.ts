import { gql } from '@apollo/client';

export const VIEWER_QUERY = gql`
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
export const VIEWER_POSTS_QUERY = gql`
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

export const VIEWER_VIDEO_PLAYLIST = gql`
  query ViewerVideoPlayList($first: Int, $after: String, $watcheAt_Gt: DateTime, $watchedAt_Lt: DateTime, $orderBy: String) {
    viewerVideoPlaylist {
      videoEntries(first: $first, after: $after, watchedAt_Gt: $watcheAt_Gt, watchedAt_Lt: $watchedAt_Lt, orderBy: $orderBy) {
        edges {
          node {
            video {
              videoId
              title
              duration
              thumbnailDefault
              thumbnailMedium
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
