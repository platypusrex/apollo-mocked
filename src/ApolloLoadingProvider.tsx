import * as React from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import { createLoadingLink } from './utils';

export const ApolloLoadingProvider: React.FC<{}> = ({ children }) => {
  const client = new ApolloClient({
    link: createLoadingLink(),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
