import * as React from 'react';
import ApolloClient from 'apollo-client';
import SchemaLink from 'apollo-link-schema';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo-hooks';
import { IMockOptions } from 'graphql-tools';
import { Omit } from 'react-apollo-hooks/lib/utils';
import { useFetchGraphQLSchema } from 'utils/useFetchGraphQLSchema';

type MockOptions = Omit<IMockOptions, 'schema'>;

interface ApolloMockingProviderProps extends MockOptions {
  url: string;
}

export const ApolloMockingProvider: React.FC<ApolloMockingProviderProps> = ({
  url,
  children,
  ...mockOptions
}) => {
  const { schema, error } = useFetchGraphQLSchema(url, mockOptions);

  console.log('schema', schema);
  console.log('error', error);

  if (error) {
    throw new Error('ApolloMockingProvider: error fetching schema');
  }

  if (!schema) {
    throw new Error('ApolloMockingProvider: fetched schema is undefined');
  }

  const client = new ApolloClient({
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
