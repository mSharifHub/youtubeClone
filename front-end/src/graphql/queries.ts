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
      user {
        username
        email
        bio
        profilePicture
        firstName
        lastName
        subscribers {
          username
        }
      }
      token
      refreshToken
    }
  }
`;
