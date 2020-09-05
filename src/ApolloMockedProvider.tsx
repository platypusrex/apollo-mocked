import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { CreateApolloClient, createApolloClient } from './utils';

export interface ApolloMockedProviderProps
  extends Omit<CreateApolloClient, 'links'> {
  Provider?: React.ComponentType<any>;
}

export const ApolloMockedProvider: React.FC<ApolloMockedProviderProps> = ({
  children,
  Provider = ApolloProvider,
  ...rest
}) => {
  const client = createApolloClient(rest);

  // @ts-ignore
  return <Provider client={client}>{children}</Provider>;
};
