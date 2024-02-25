import React from 'react';
import { useQuery } from '@apollo/client';
import { DOG_QUERY } from './gql/dogQuery';

export const NetworkError: React.FC = () => {
  const { data, loading, error } = useQuery(DOG_QUERY);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error?.networkError) {
    return <p>{error.networkError.message}</p>;
  }

  return (
    <p>
      {data?.dog?.name} is a {data?.dog?.breed}
    </p>
  );
};
