import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const GET_DOG_QUERY = gql`
  query getDog($name: String) {
    dog(name: $name) {
      id
      name
      breed
    }
  }
`;

export interface TestComponent {
  name: string;
}

export const TestComponent: React.FC<TestComponent> = ({ name }) => {
  const { data, loading, error } = useQuery(GET_DOG_QUERY, { variables: name });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <p>
      {data.dog.name} is a {data.dog.breed}
    </p>
  );
};
