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
