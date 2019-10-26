import * as React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { MockedResponse } from '@apollo/react-testing';
import {
  InMemoryCacheConfig,
  NormalizedCacheObject,
} from 'apollo-cache-inmemory';
import { ApolloClientOptions } from 'apollo-client';
import { createApolloClient, LinkSchemaProps } from './utils';

export interface ApolloMockedProviderProps {
  addTypename?: boolean;
  cacheOptions?: InMemoryCacheConfig;
  clientOptions?: ApolloClientOptions<NormalizedCacheObject>;
  mocks: ReadonlyArray<MockedResponse> | LinkSchemaProps;
  Provider?: React.ComponentType<any>;
}

export const ApolloMockedProvider: React.FC<ApolloMockedProviderProps> = ({
  children,
  Provider = ApolloProvider,
  ...rest
}) => {
  const client = createApolloClient(rest);

  return <Provider client={client}>{children}</Provider>;
};
