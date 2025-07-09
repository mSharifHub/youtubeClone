import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type CreatePost = {
  __typename?: 'CreatePost';
  post?: Maybe<PostType>;
};

export type ErrorType = {
  __typename?: 'ErrorType';
  field: Scalars['String']['output'];
  messages: Array<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost?: Maybe<CreatePost>;
  userUpdate?: Maybe<UserSerializerMutationPayload>;
};


export type MutationCreatePostArgs = {
  content?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<InputMaybe<Scalars['Upload']['input']>>>;
};


export type MutationUserUpdateArgs = {
  input: UserSerializerMutationInput;
};

/** An object with an ID */
export type Node = {
  /** The ID of the object. */
  id: Scalars['ID']['output'];
};

export type PostImageType = {
  __typename?: 'PostImageType';
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
};

export type PostType = {
  __typename?: 'PostType';
  author: UserType;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  images?: Maybe<Array<Maybe<PostImageType>>>;
  profilePicture?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  allPosts?: Maybe<Array<Maybe<PostType>>>;
  allUsers?: Maybe<Array<Maybe<UserType>>>;
  me?: Maybe<UserNode>;
  viewer?: Maybe<UserType>;
  viewerPosts?: Maybe<Array<Maybe<PostType>>>;
};

export type UserNode = Node & {
  __typename?: 'UserNode';
  archived?: Maybe<Scalars['Boolean']['output']>;
  bio: Scalars['String']['output'];
  dateJoined: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  googleSub: Scalars['String']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
  isActive: Scalars['Boolean']['output'];
  /** Designates whether the user can log into this admin site. */
  isStaff: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  lastLogin?: Maybe<Scalars['DateTime']['output']>;
  lastName: Scalars['String']['output'];
  pk?: Maybe<Scalars['Int']['output']>;
  posts: Array<PostType>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  secondaryEmail?: Maybe<Scalars['String']['output']>;
  subscribedTo: Array<UserType>;
  subscribers: Array<UserType>;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']['output'];
  verified?: Maybe<Scalars['Boolean']['output']>;
  youtubeHandler: Scalars['String']['output'];
};

export type UserSerializerMutationInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  googleSub: Scalars['String']['input'];
  /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isVerified?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  subscribers?: InputMaybe<Scalars['String']['input']>;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']['input'];
  youtubeHandler: Scalars['String']['input'];
};

export type UserSerializerMutationPayload = {
  __typename?: 'UserSerializerMutationPayload';
  bio?: Maybe<Scalars['String']['output']>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  /** May contain more than one error for same field. */
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  firstName?: Maybe<Scalars['String']['output']>;
  googleSub?: Maybe<Scalars['String']['output']>;
  /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isVerified?: Maybe<Scalars['Boolean']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  subscribers?: Maybe<Scalars['String']['output']>;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username?: Maybe<Scalars['String']['output']>;
  youtubeHandler?: Maybe<Scalars['String']['output']>;
};

export type UserType = {
  __typename?: 'UserType';
  bio: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  googleSub: Scalars['String']['output'];
  /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
  isActive: Scalars['Boolean']['output'];
  /** Designates whether the user can log into this admin site. */
  isStaff: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  posts: Array<PostType>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  subscribers: Array<UserType>;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']['output'];
  youtubeHandler: Scalars['String']['output'];
};

export type CreatePostMutationVariables = Exact<{
  content: Scalars['String']['input'];
  images?: InputMaybe<Array<Scalars['Upload']['input']> | Scalars['Upload']['input']>;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost?: { __typename?: 'CreatePost', post?: { __typename?: 'PostType', id: string, content: string, createdAt: any, author: { __typename?: 'UserType', youtubeHandler: string }, images?: Array<{ __typename?: 'PostImageType', image?: string | null } | null> | null } | null } | null };

export type ViewerQueryVariables = Exact<{ [key: string]: never }>;

export type ViewerQuery = { __typename?: 'Query', viewer?: { __typename?: 'UserType', firstName: string, lastName: string, username: string, youtubeHandler: string, email: string, profilePicture?: string | null, bio: string, subscribers: Array<{ __typename?: 'UserType', username: string, email: string }>, posts: Array<{ __typename?: 'PostType', content: string, createdAt: any, author: { __typename?: 'UserType', youtubeHandler: string }, images?: Array<{ __typename?: 'PostImageType', image?: string | null } | null> | null }> } | null };

export type ViewerPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type ViewerPostsQuery = { __typename?: 'Query', viewerPosts?: Array<{ __typename?: 'PostType', id: string, content: string, createdAt: any, profilePicture?: string | null, author: { __typename?: 'UserType', youtubeHandler: string }, images?: Array<{ __typename?: 'PostImageType', image?: string | null } | null> | null } | null> | null };


export const CreatePostDocument = gql`
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
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      content: // value for 'content'
 *      images: // value for 'images'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const ViewerDocument = gql`
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

/**
 * __useViewerQuery__
 *
 * To run a query within a React component, call `useViewerQuery` and pass it any options that fit your needs.
 * When your component renders, `useViewerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useViewerQuery({
 *   variables: {
 *   },
 * });
 */
export function useViewerQuery(baseOptions?: Apollo.QueryHookOptions<ViewerQuery, ViewerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ViewerQuery, ViewerQueryVariables>(ViewerDocument, options);
      }
export function useViewerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ViewerQuery, ViewerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ViewerQuery, ViewerQueryVariables>(ViewerDocument, options);
        }
export function useViewerSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ViewerQuery, ViewerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ViewerQuery, ViewerQueryVariables>(ViewerDocument, options);
        }
export type ViewerQueryHookResult = ReturnType<typeof useViewerQuery>;
export type ViewerLazyQueryHookResult = ReturnType<typeof useViewerLazyQuery>;
export type ViewerSuspenseQueryHookResult = ReturnType<typeof useViewerSuspenseQuery>;
export type ViewerQueryResult = Apollo.QueryResult<ViewerQuery, ViewerQueryVariables>;
export const ViewerPostsDocument = gql`
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

/**
 * __useViewerPostsQuery__
 *
 * To run a query within a React component, call `useViewerPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useViewerPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useViewerPostsQuery({
 *   variables: {
 *   },
 * });
 */
export function useViewerPostsQuery(baseOptions?: Apollo.QueryHookOptions<ViewerPostsQuery, ViewerPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ViewerPostsQuery, ViewerPostsQueryVariables>(ViewerPostsDocument, options);
      }
export function useViewerPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ViewerPostsQuery, ViewerPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ViewerPostsQuery, ViewerPostsQueryVariables>(ViewerPostsDocument, options);
        }
export function useViewerPostsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ViewerPostsQuery, ViewerPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ViewerPostsQuery, ViewerPostsQueryVariables>(ViewerPostsDocument, options);
        }
export type ViewerPostsQueryHookResult = ReturnType<typeof useViewerPostsQuery>;
export type ViewerPostsLazyQueryHookResult = ReturnType<typeof useViewerPostsLazyQuery>;
export type ViewerPostsSuspenseQueryHookResult = ReturnType<typeof useViewerPostsSuspenseQuery>;
export type ViewerPostsQueryResult = Apollo.QueryResult<ViewerPostsQuery, ViewerPostsQueryVariables>;
