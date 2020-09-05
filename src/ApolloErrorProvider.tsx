import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { GraphQLError } from 'graphql';
import { createErrorLink } from './utils';

export interface ApolloErrorProviderProps {
  graphQLError?: string | GraphQLError[];
  Provider?: React.ComponentType<any>;
}

export const ApolloErrorProvider: React.FC<ApolloErrorProviderProps> = ({
  children,
  graphQLError,
  Provider = ApolloProvider,
}) => {
  const client = new ApolloClient({
    // @ts-ignore
    link: createErrorLink(graphQLError),
    cache: new InMemoryCache(),
  });

  // @ts-ignore
  return <Provider client={client}>{children}</Provider>;
};
