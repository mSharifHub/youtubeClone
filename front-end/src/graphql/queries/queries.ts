import { gql } from '@apollo/client';

export const DeleteCookie = gql`
  mutation DeleteCookie {
    deleteTokenCookie {
      deleted
    }
  }
`;

export const DeleteRefreshCookie = gql`
  mutation DeleteRefreshCookie {
    deleteRefreshTokenCookie {
      deleted
    }
  }
`;

export const GOOGLE_AUTH = gql`
  mutation GoogleAuth($code: String!) {
    googleAuth(code: $code) {
      isSuccess
    }
  }
`;

export const VIEWER_QUERY = gql`
  query Viewer {
    viewer {
      firstName
      lastName
      username
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
