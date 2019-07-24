import * as React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { IMocks } from 'graphql-tools';
import { IntrospectionQuery } from 'graphql';
import { createApolloClient } from './utils';

export interface ApolloMockedProviderProps {
  mocks: IMocks;
  introspectionResult: IntrospectionQuery | any;
}

export const ApolloMockedProvider: React.FC<ApolloMockedProviderProps> = ({
  mocks,
  introspectionResult,
  children,
}) => {
  const client = createApolloClient({ mocks, introspectionResult });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
