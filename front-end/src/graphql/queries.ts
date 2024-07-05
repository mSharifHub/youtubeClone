import { gql } from '@apollo/client';

export const SOCIAL_AUTH = gql`
  mutation SocialAuth($provider: String!, $accessToken: String!) {
    socialAuth(provider: $provider, accessToken: $accessToken) {
      user {
        id
        username
        profilePicture
        bio
        isVerified
        email
        subscribers {
          username
        }
      }
      token
      refreshToken
    }
  }
`;

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
        id
        username
        profilePicture
        bio
        isVerified
        email
        subscribers {
          username
        }
      }
      token
      refreshToken
    }
  }
`;
