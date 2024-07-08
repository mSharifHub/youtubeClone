
import {  useQuery } from "@apollo/client";
import { GET_ALL_USERS } from '../graphql/queries/queries.ts';
import React from 'react';

const ALL_USERS: React.FC = () =>{

  const { loading, error, data } = useQuery(GET_ALL_USERS);

  console.log({ loading, error, data });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>All Users</h1>
      <ul>
        {data.allUsers.map((user: any) => (
          <li key={user.id}>
            {user.username} - {user.email}
            {user.bio}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ALL_USERS;
