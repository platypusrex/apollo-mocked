import * as React from 'react';
import ApolloClient from 'apollo-client';
import SchemaLink from 'apollo-link-schema';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo-hooks';
import {
  addMockFunctionsToSchema,
  IMockOptions,
  ITypeDefinitions,
  makeExecutableSchema,
} from 'graphql-tools';

type MockOptions = Omit<IMockOptions, 'schema'>;

interface ApolloMockingProviderProps extends MockOptions {
  typeDefs: ITypeDefinitions;
}

export const ApolloMockingProvider: React.FC<ApolloMockingProviderProps> = ({
  typeDefs,
  children,
  ...mockOptions
}) => {
  const schema = makeExecutableSchema({ typeDefs });
  addMockFunctionsToSchema({ schema, ...mockOptions });

  const client = new ApolloClient({
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
