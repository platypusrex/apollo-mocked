import * as React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { IMocks, ITypeDefinitions } from 'graphql-tools';
import { createApolloClient } from 'utils';

interface ApolloMockedProviderProps {
  mocks: IMocks;
  typeDefs: ITypeDefinitions;
}

export const ApolloMockedProvider: React.FC<ApolloMockedProviderProps> = ({
  mocks,
  typeDefs,
  children,
}) => {
  const client = createApolloClient({ mocks, typeDefs });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
