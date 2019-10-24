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
  Provider?: React.FC;
}

export const ApolloMockedProvider: React.FC<ApolloMockedProviderProps> = ({
  children,
  Provider = ApolloProvider,
  ...rest
}) => {
  const client = createApolloClient(rest);

  return <Provider client={client}>{children}</Provider>;
};
