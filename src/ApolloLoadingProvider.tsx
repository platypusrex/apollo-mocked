import * as React from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import { createLoadingLink } from './utils';

export interface ApolloLoadingProviderProps {
  Provider?: React.ComponentType<any>;
}

export const ApolloLoadingProvider: React.FC<ApolloLoadingProviderProps> = ({
  Provider = ApolloProvider,
  children,
}) => {
  const client = new ApolloClient({
    link: createLoadingLink(),
    cache: new InMemoryCache(),
  });

  return <Provider client={client}>{children}</Provider>;
};
