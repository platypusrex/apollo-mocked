import React from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

export const GET_DOG_QUERY = gql`
  query {
    dog {
      name
      breed
    }
  }
`;

export const Component: React.FC = () => {
  const { data, loading, error } = useQuery(GET_DOG_QUERY);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error?.graphQLErrors) {
    return (
      <>
        {error?.graphQLErrors.map((error, i) => (
          <p key={i}>{error.message}</p>
        ))}
      </>
    );
  }

  return (
    <p>
      {data.dog.name} is a {data.dog.breed}
    </p>
  );
};
