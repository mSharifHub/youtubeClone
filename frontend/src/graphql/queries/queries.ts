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
      posts {
        content
        createdAt
        author {
          youtubeHandler
        }
        images {
          image
        }
      }
    }
  }
`;

export const VIEWER_POSTS_QUERY = gql`
  query ViewerPosts {
    viewerPosts {
      id
      content
      createdAt
      author {
        youtubeHandler
      }
      profilePicture
      images {
        image
      }
    }
  }
`;
