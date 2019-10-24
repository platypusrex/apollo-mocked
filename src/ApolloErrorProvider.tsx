import * as React from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import { createErrorLink } from './utils';

export interface ApolloErrorProviderProps {
  errorMessages?: string | string[];
  Provider?: React.ComponentType;
}

export const ApolloErrorProvider: React.FC<ApolloErrorProviderProps> = ({
  children,
  errorMessages,
  Provider = ApolloProvider,
}) => {
  const client = new ApolloClient({
    link: createErrorLink(errorMessages),
    cache: new InMemoryCache(),
  });

  return <Provider client={client}>{children}</Provider>;
};
