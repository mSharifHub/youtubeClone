import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    allUsers {
      id
      username
      email
      isStaff
      profilePicture
      bio
      isVerified
    }
  }
`;

export const GET_USER_BY_NAME = gql`
  query GetUserByUsername($username: String!) {
    userByUsername(username: $username) {
      id
      username
      email
      bio
    }
  }
`;

export const GET_STAFF_USERS = gql`
  query GetStaffUsers {
    staffUsers {
      id
      username
      email
      bio
    }
  }
`;
