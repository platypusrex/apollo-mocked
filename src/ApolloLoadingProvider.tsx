import * as React from 'react';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import { Observable } from 'apollo-client/util/Observable';

export const ApolloLoadingProvider: React.FC<{}> = ({ children }) => {
  const link = new ApolloLink(() => {
    return new Observable(() => {});
  });

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
