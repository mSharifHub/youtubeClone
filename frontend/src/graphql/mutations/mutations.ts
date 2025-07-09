import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation CreatePost($content: String!, $images: [Upload!]) {
    createPost(content: $content, images: $images) {
      post {
        id
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
