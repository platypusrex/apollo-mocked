import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createLoadingLink } from './utils';

export interface ApolloLoadingProviderProps {
  Provider?: React.ComponentType<any>;
}

export const ApolloLoadingProvider: React.FC<ApolloLoadingProviderProps> = ({
  Provider = ApolloProvider,
  children,
}) => {
  const client = new ApolloClient({
    // @ts-ignore
    link: createLoadingLink(),
    cache: new InMemoryCache(),
  });

  // @ts-ignore
  return <Provider client={client}>{children}</Provider>;
};
