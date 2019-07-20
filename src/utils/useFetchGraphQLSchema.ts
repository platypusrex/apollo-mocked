import { useState, useEffect } from 'react';
import { GraphQLSchema } from 'graphql';
import { fetchGraphQLSchema } from 'utils/fetchGraphQLSchema';
import {
  addMockFunctionsToSchema,
  IMockOptions,
  makeExecutableSchema,
} from 'graphql-tools';
import { Omit } from 'react-apollo-hooks/lib/utils';

interface UseFetchGraphQLSchemaState {
  schema?: GraphQLSchema;
  error?: Error;
}

type MockOptions = Omit<IMockOptions, 'schema'>;

type UseFetchGraphQLSchema = (
  url: string,
  mockOptions: MockOptions
) => UseFetchGraphQLSchemaState;

export const useFetchGraphQLSchema: UseFetchGraphQLSchema = (
  url,
  mockOptions
) => {
  const [state, setState] = useState<UseFetchGraphQLSchemaState>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const typeDefs = await fetchGraphQLSchema(url, true);

        const schema = makeExecutableSchema({ typeDefs });
        addMockFunctionsToSchema({ schema, ...mockOptions });

        setState({ schema });
      } catch (error) {
        setState({ error: error });
      }
    };

    fetchData();
  }, [url]);

  return { ...state };
};
