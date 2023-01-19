import React from 'react';
import { useQuery } from '@apollo/client';
import { DOG_QUERY } from './gql/dogQuery';
import { DogQuery, DogQueryVariables } from './generated';

interface DogProps {
  includeName?: boolean;
}
export const Dog: React.FC<DogProps> = ({ includeName = true }) => {
  const { data, loading, error } = useQuery<DogQuery, DogQueryVariables>(
    DOG_QUERY,
    {
      variables: { includeName },
    }
  );

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
      {data?.dog?.name} is a {data?.dog?.breed}
    </p>
  );
};
