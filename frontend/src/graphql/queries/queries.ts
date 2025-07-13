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
  query ViewerPosts($first: Int, $after: String, $orderBy: String) {
    viewerPosts(first: $first, after: $after, orderBy: $orderBy) {
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
