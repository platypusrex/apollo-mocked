import * as React from 'react';
import ApolloClient from 'apollo-client';
import SchemaLink from 'apollo-link-schema';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import {
  buildClientSchema,
  // IntrospectionNamedTypeRef,
  // IntrospectionObjectType,
  // IntrospectionQuery,
} from 'graphql';
import { addMockFunctionsToSchema, IMockOptions } from 'graphql-tools';
// import Maybe from 'graphql/tsutils/Maybe';

type MockOptions = Omit<IMockOptions, 'schema'>;
// type QueryType = Omit<
//   IntrospectionNamedTypeRef<IntrospectionObjectType>,
//   'kind'
// >;
// type MutationType = Omit<
//   Maybe<IntrospectionNamedTypeRef<IntrospectionObjectType>>,
//   'kind'
// >;
// type IntrospectionResult = Omit<
//   IntrospectionQuery,
//   'queryType' | 'mutationType'
// > & {
//   queryType: QueryType;
//   mutationType: MutationType;
// };

interface ApolloMockingProviderProps extends MockOptions {
  introspectionResult: any;
}

export const ApolloMockingProvider: React.FC<ApolloMockingProviderProps> = ({
  introspectionResult,
  children,
  ...mockOptions
}) => {
  const schema = buildClientSchema(introspectionResult);
  addMockFunctionsToSchema({ schema, ...mockOptions });

  const client = new ApolloClient({
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
