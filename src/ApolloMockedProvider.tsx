import * as React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { MockedResponse } from '@apollo/react-testing';
import {
  InMemoryCacheConfig,
  NormalizedCacheObject,
} from 'apollo-cache-inmemory';
import { ApolloClientOptions } from 'apollo-client';
import { createApolloClient, LinkSchemaProps } from './utils';

interface ApolloMockedProviderProps {
  mocks: ReadonlyArray<MockedResponse> | LinkSchemaProps;
  addTypename?: boolean;
  cacheOptions?: InMemoryCacheConfig;
  clientOptions?: ApolloClientOptions<NormalizedCacheObject>;
}

export const ApolloMockedProvider: React.FC<ApolloMockedProviderProps> = ({
  children,
  ...rest
}) => {
  const client = createApolloClient(rest);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
