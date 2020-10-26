import * as React from 'react';
import {
  ApolloClientOptions,
  ApolloProvider,
  InMemoryCacheConfig,
  NormalizedCacheObject,
} from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import { createApolloClient, LinkSchemaProps } from './utils';

export interface ApolloMockedProviderProps {
  mocks: ReadonlyArray<MockedResponse> | LinkSchemaProps;
  addTypename?: boolean;
  cacheOptions?: InMemoryCacheConfig;
  clientOptions?: ApolloClientOptions<NormalizedCacheObject>;
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
