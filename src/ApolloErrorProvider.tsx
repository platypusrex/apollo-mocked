import * as React from 'react';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo-hooks';
import { Observable } from 'apollo-client/util/Observable';
import { GraphQLError } from 'graphql';

export interface ErrorProviderProps {
  graphQLErrors: ReadonlyArray<GraphQLError>;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({
  children,
  graphQLErrors,
}) => {
  const link = new ApolloLink(() => {
    return new Observable(observer => {
      observer.next({
        errors: graphQLErrors || [
          { message: 'Unspecified error from ErrorProvider.' },
        ],
      });
      observer.complete();
    });
  });

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
