import * as React from 'react';
import ApolloClient from 'apollo-client';
import SchemaLink from 'apollo-link-schema';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { addMockFunctionsToSchema, IMockOptions } from 'graphql-tools';

export const MockingProvider: React.FC<IMockOptions> = ({ schema, children, ...mockOptions }) => {
  addMockFunctionsToSchema({ schema, ...mockOptions });

  const client = new ApolloClient({
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
};