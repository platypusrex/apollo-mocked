import * as React from 'react';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { Observable } from 'apollo-client/util/Observable';
import { GraphQLError } from 'graphql';

export interface ErrorProviderProps {
  errorMessages?: string | string[];
}

export const ApolloErrorProvider: React.FC<ErrorProviderProps> = ({
  children,
  errorMessages,
}) => {
  const link = new ApolloLink(() => {
    return new Observable(observer => {
      observer.next({
        errors: createGraphQLErrorMessage(errorMessages),
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

function createGraphQLErrorMessage(
  messages?: string | string[]
): GraphQLError[] {
  if (!messages) {
    return [new GraphQLError('Unspecified error from ErrorProvider.')];
  }

  const errorMessages = Array.isArray(messages) ? [...messages] : [messages];

  return errorMessages.map(message => new GraphQLError(message));
}
