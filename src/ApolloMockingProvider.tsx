import * as React from 'react';
import ApolloClient from 'apollo-client';
import SchemaLink from 'apollo-link-schema';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo-hooks';
import { buildClientSchema, IntrospectionQuery } from 'graphql';
import { addMockFunctionsToSchema, IMockOptions } from 'graphql-tools';

type MockOptions = Omit<IMockOptions, 'schema'>;

interface ApolloMockingProviderProps extends MockOptions {
  introspectionResult: IntrospectionQuery;
}

export const ApolloMockingProvider: React.FC<ApolloMockingProviderProps> = ({
  introspectionResult,
  children,
  ...mockOptions
}) => {
  const schema = buildClientSchema(introspectionResult);
  addMockFunctionsToSchema({ schema, ...mockOptions });

  const client = new ApolloClient({
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
