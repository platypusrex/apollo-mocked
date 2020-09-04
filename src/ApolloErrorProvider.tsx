import * as React from 'react';
import { GraphQLError } from 'graphql';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
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
    link: createErrorLink(graphQLError),
    cache: new InMemoryCache(),
  });

  return <Provider client={client}>{children}</Provider>;
};
