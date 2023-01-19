import React from 'react';
import { useQuery } from '@apollo/client';
import { HUMAN_QUERY } from './gql/humanQuery';
import { HumanQuery, HumanQueryVariables } from './generated';
export const Human: React.FC = () => {
  const { data, loading, error } = useQuery<HumanQuery, HumanQueryVariables>(
    HUMAN_QUERY
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
      {data?.human?.name} is {data?.human?.age} years old.
    </p>
  );
};
