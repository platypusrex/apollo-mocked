import * as React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { createLoadingLink } from './utils';

export interface ApolloLoadingProviderProps {
  Provider?: React.ComponentType<any>;
  children?: React.ReactNode;
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
