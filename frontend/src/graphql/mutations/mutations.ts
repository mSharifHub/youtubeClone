import { DocumentNode, gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation CreatePost($content: String!, $images: [Upload!]) {
    createPost(content: $content, images: $images) {
      cursor
      post {
        __typename
        id
        content
        createdAt
        profilePicture
        author {
          youtubeHandler
        }
        images {
          __typename
          image
        }
      }
    }
  }
`;

export const EDIT_POST = gql`
  mutation EditPost($postId: ID!, $content: String!) {
    editPost(postId: $postId, content: $content) {
      post {
        __typename
        id
        content
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId) {
      post {
        __typename
        id
      }
      success
    }
  }
`;

export const RATE_YOUTUBE_VIDEO: DocumentNode = gql`
  mutation rateYoutubeVideo($videoId: String!, $action: String!) {
    rateYoutubeVideo(videoId: $videoId, action: $action) {
      success
      newRating
    }
  }
`;

export const SAVE_VIDEO_PLAYLIST = gql`
  mutation saveVideoPlaylist($video: VideoInput!) {
    saveVideoPlaylist(video: $video) {
      cursor
      videoEntry {
        __typename
        id
        watchedAt
        video {
          id
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
      }
    }
  }
`;
