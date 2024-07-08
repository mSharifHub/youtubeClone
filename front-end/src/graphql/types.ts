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
  GenericScalar: { input: any; output: any; }
};

export type DeleteJsonWebTokenCookie = {
  __typename?: 'DeleteJSONWebTokenCookie';
  deleted: Scalars['Boolean']['output'];
};

export type DeleteRefreshTokenCookie = {
  __typename?: 'DeleteRefreshTokenCookie';
  deleted: Scalars['Boolean']['output'];
};

export type ErrorType = {
  __typename?: 'ErrorType';
  field: Scalars['String']['output'];
  messages: Array<Scalars['String']['output']>;
};

export type GoogleAuth = {
  __typename?: 'GoogleAuth';
  isSuccess?: Maybe<Scalars['Boolean']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteRefreshTokenCookie?: Maybe<DeleteRefreshTokenCookie>;
  deleteTokenCookie?: Maybe<DeleteJsonWebTokenCookie>;
  googleAuth?: Maybe<GoogleAuth>;
  refreshToken?: Maybe<Refresh>;
  revokeToken?: Maybe<Revoke>;
  /** Obtain JSON Web Token mutation */
  tokenAuth?: Maybe<ObtainJsonWebToken>;
  userSerializer?: Maybe<UserSerializerMutationPayload>;
  verifyToken?: Maybe<Verify>;
};


export type MutationGoogleAuthArgs = {
  code: Scalars['String']['input'];
};


export type MutationRefreshTokenArgs = {
  token?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRevokeTokenArgs = {
  refreshToken?: InputMaybe<Scalars['String']['input']>;
};


export type MutationTokenAuthArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUserSerializerArgs = {
  input: UserSerializerMutationInput;
};


export type MutationVerifyTokenArgs = {
  token?: InputMaybe<Scalars['String']['input']>;
};

/** An object with an ID */
export type Node = {
  /** The ID of the object */
  id: Scalars['ID']['output'];
};

/** Obtain JSON Web Token mutation */
export type ObtainJsonWebToken = {
  __typename?: 'ObtainJSONWebToken';
  payload: Scalars['GenericScalar']['output'];
  refreshExpiresIn: Scalars['Int']['output'];
  token: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  allUsers?: Maybe<Array<Maybe<UserType>>>;
  me?: Maybe<UserNode>;
  viewer?: Maybe<UserType>;
};

export type Refresh = {
  __typename?: 'Refresh';
  payload: Scalars['GenericScalar']['output'];
  refreshExpiresIn: Scalars['Int']['output'];
  token: Scalars['String']['output'];
};

export type Revoke = {
  __typename?: 'Revoke';
  revoked: Scalars['Int']['output'];
};

export type UserNode = Node & {
  __typename?: 'UserNode';
  archived?: Maybe<Scalars['Boolean']['output']>;
  bio: Scalars['String']['output'];
  dateJoined: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  /** The ID of the object */
  id: Scalars['ID']['output'];
  /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
  isActive: Scalars['Boolean']['output'];
  /** Designates whether the user can log into this admin site. */
  isStaff: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  lastLogin?: Maybe<Scalars['DateTime']['output']>;
  lastName: Scalars['String']['output'];
  pk?: Maybe<Scalars['Int']['output']>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  secondaryEmail?: Maybe<Scalars['String']['output']>;
  subscribedTo: Array<UserType>;
  subscribers: Array<UserType>;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']['output'];
  verified?: Maybe<Scalars['Boolean']['output']>;
};

export type UserSerializerMutationInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isVerified?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  profilePicture?: InputMaybe<Scalars['String']['input']>;
  subscribers?: InputMaybe<Scalars['String']['input']>;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']['input'];
};

export type UserSerializerMutationPayload = {
  __typename?: 'UserSerializerMutationPayload';
  bio?: Maybe<Scalars['String']['output']>;
  clientMutationId?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  /** May contain more than one error for same field. */
  errors?: Maybe<Array<Maybe<ErrorType>>>;
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isVerified?: Maybe<Scalars['Boolean']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  subscribers?: Maybe<Scalars['String']['output']>;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username?: Maybe<Scalars['String']['output']>;
};

export type UserType = {
  __typename?: 'UserType';
  bio: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
  isActive: Scalars['Boolean']['output'];
  /** Designates whether the user can log into this admin site. */
  isStaff: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  profilePicture?: Maybe<Scalars['String']['output']>;
  subscribers: Array<UserType>;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']['output'];
};

export type Verify = {
  __typename?: 'Verify';
  payload: Scalars['GenericScalar']['output'];
};

export type DeleteCookieMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteCookieMutation = { __typename?: 'Mutation', deleteTokenCookie?: { __typename?: 'DeleteJSONWebTokenCookie', deleted: boolean } | null };

export type DeleteRefreshCookieMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteRefreshCookieMutation = { __typename?: 'Mutation', deleteRefreshTokenCookie?: { __typename?: 'DeleteRefreshTokenCookie', deleted: boolean } | null };

export type GoogleAuthMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type GoogleAuthMutation = { __typename?: 'Mutation', googleAuth?: { __typename?: 'GoogleAuth', isSuccess?: boolean | null } | null };

export type ViewerQueryVariables = Exact<{ [key: string]: never; }>;


export type ViewerQuery = { __typename?: 'Query', viewer?: { __typename?: 'UserType', firstName: string, lastName: string, username: string, email: string, profilePicture?: string | null, bio: string, subscribers: Array<{ __typename?: 'UserType', username: string, email: string }> } | null };


export const DeleteCookieDocument = gql`
    mutation DeleteCookie {
  deleteTokenCookie {
    deleted
  }
}
    `;
export type DeleteCookieMutationFn = Apollo.MutationFunction<DeleteCookieMutation, DeleteCookieMutationVariables>;

/**
 * __useDeleteCookieMutation__
 *
 * To run a mutation, you first call `useDeleteCookieMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCookieMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCookieMutation, { data, loading, error }] = useDeleteCookieMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteCookieMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCookieMutation, DeleteCookieMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCookieMutation, DeleteCookieMutationVariables>(DeleteCookieDocument, options);
      }
export type DeleteCookieMutationHookResult = ReturnType<typeof useDeleteCookieMutation>;
export type DeleteCookieMutationResult = Apollo.MutationResult<DeleteCookieMutation>;
export type DeleteCookieMutationOptions = Apollo.BaseMutationOptions<DeleteCookieMutation, DeleteCookieMutationVariables>;
export const DeleteRefreshCookieDocument = gql`
    mutation DeleteRefreshCookie {
  deleteRefreshTokenCookie {
    deleted
  }
}
    `;
export type DeleteRefreshCookieMutationFn = Apollo.MutationFunction<DeleteRefreshCookieMutation, DeleteRefreshCookieMutationVariables>;

/**
 * __useDeleteRefreshCookieMutation__
 *
 * To run a mutation, you first call `useDeleteRefreshCookieMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRefreshCookieMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRefreshCookieMutation, { data, loading, error }] = useDeleteRefreshCookieMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteRefreshCookieMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRefreshCookieMutation, DeleteRefreshCookieMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRefreshCookieMutation, DeleteRefreshCookieMutationVariables>(DeleteRefreshCookieDocument, options);
      }
export type DeleteRefreshCookieMutationHookResult = ReturnType<typeof useDeleteRefreshCookieMutation>;
export type DeleteRefreshCookieMutationResult = Apollo.MutationResult<DeleteRefreshCookieMutation>;
export type DeleteRefreshCookieMutationOptions = Apollo.BaseMutationOptions<DeleteRefreshCookieMutation, DeleteRefreshCookieMutationVariables>;
export const GoogleAuthDocument = gql`
    mutation GoogleAuth($code: String!) {
  googleAuth(code: $code) {
    isSuccess
  }
}
    `;
export type GoogleAuthMutationFn = Apollo.MutationFunction<GoogleAuthMutation, GoogleAuthMutationVariables>;

/**
 * __useGoogleAuthMutation__
 *
 * To run a mutation, you first call `useGoogleAuthMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGoogleAuthMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [googleAuthMutation, { data, loading, error }] = useGoogleAuthMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useGoogleAuthMutation(baseOptions?: Apollo.MutationHookOptions<GoogleAuthMutation, GoogleAuthMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GoogleAuthMutation, GoogleAuthMutationVariables>(GoogleAuthDocument, options);
      }
export type GoogleAuthMutationHookResult = ReturnType<typeof useGoogleAuthMutation>;
export type GoogleAuthMutationResult = Apollo.MutationResult<GoogleAuthMutation>;
export type GoogleAuthMutationOptions = Apollo.BaseMutationOptions<GoogleAuthMutation, GoogleAuthMutationVariables>;
export const ViewerDocument = gql`
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