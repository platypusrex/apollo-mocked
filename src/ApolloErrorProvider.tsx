import * as React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { GraphQLError } from 'graphql';
import { createErrorLink } from './utils';

export interface ApolloErrorProviderProps {
  graphQLError?: string | GraphQLError[];
  Provider?: React.ComponentType<any>;
  children?: React.ReactNode;
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
