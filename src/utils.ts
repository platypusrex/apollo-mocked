import { addMocksToSchema, IMocks } from '@graphql-tools/mock';
import { MockedResponse, MockLink } from '@apollo/client/testing';
import {
  ApolloClient,
  ApolloClientOptions,
  ApolloLink,
  FetchResult,
  InMemoryCache,
  InMemoryCacheConfig,
  NormalizedCacheObject,
  Observable,
  OperationVariables,
} from '@apollo/client';
import {
  buildClientSchema,
  graphql,
  print,
  DocumentNode,
  GraphQLError,
  GraphQLSchema,
  IntrospectionQuery,
} from 'graphql';

export declare type ResultFunction<T> = () => T;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

interface CreateLinkOptions {
  delay?: number;
}

function createMockLink(
  schema: GraphQLSchema,
  rootValue = {},
  context = {},
  options: CreateLinkOptions = {}
): ApolloLink {
  const delayMs = options?.delay ?? 0;

  return new ApolloLink((operation) => {
    return new Observable((observer) => {
      const { query, operationName, variables } = operation;
      delay(delayMs)
        .then(() => {
          return graphql({
            schema,
            source: print(query),
            rootValue,
            contextValue: context,
            variableValues: variables,
            operationName,
          });
        })
        .then((result) => {
          const originalError = result?.errors?.[0].originalError;
          if (originalError) {
            // @ts-ignore
            const graphQLErrors = originalError?.graphQLErrors;
            if (graphQLErrors) {
              observer.next({ errors: graphQLErrors });
            }
            // @ts-ignore
            const networkError = originalError.networkError;
            if (networkError) {
              observer.error(networkError);
            }
          } else {
            observer.next(result);
          }
          observer.complete();
        })
        .catch(observer.error.bind(observer));
    });
  });
}

export function createErrorLink(
  graphQLError?: string | GraphQLError[]
): ApolloLink {
  return new ApolloLink(() => {
    return new Observable((observer) => {
      delay(100)
        .then(() => {
          observer.next({
            errors: createGraphQLErrorMessage(graphQLError),
          });
          observer.complete();
        })
        .catch(observer.error.bind(observer));
    });
  });
}

export function createLoadingLink(): ApolloLink {
  return new ApolloLink(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return new Observable(() => {});
  });
}

export interface LinkSchemaProps {
  resolvers: IMocks;
  introspectionResult: IntrospectionQuery | any;
  rootValue?: any;
  context?: any;
}

export interface CreateApolloClient {
  mocks: ReadonlyArray<MockedResponse> | LinkSchemaProps;
  delay?: number;
  cacheOptions?: InMemoryCacheConfig;
  clientOptions?: ApolloClientOptions<NormalizedCacheObject>;
  links?: (cache?: InMemoryCache) => ApolloLink[];
  addTypename?: boolean;
}

export function createApolloClient({
  mocks,
  delay = 0,
  cacheOptions = {},
  clientOptions = {} as any,
  links = () => {
    return [];
  },
  addTypename = false,
}: CreateApolloClient) {
  let mockLink;

  if (!Array.isArray(mocks)) {
    const apolloLinkOptions: CreateLinkOptions = {};
    const {
      resolvers,
      introspectionResult,
      rootValue,
      context,
    } = mocks as LinkSchemaProps;

    const schema = buildClientSchema(introspectionResult);
    const schemaWithMocks = addMocksToSchema({ schema, resolvers });

    if (delay) {
      apolloLinkOptions.delay = delay;
    }

    mockLink = createMockLink(
      schemaWithMocks,
      rootValue,
      context,
      apolloLinkOptions
    );
  } else {
    mockLink = new MockLink(mocks as MockedResponse[], addTypename);
  }

  const cache = new InMemoryCache({ ...cacheOptions, addTypename });

  return new ApolloClient({
    // @ts-ignore
    cache,
    link: ApolloLink.from([...links(cache), mockLink]),
    ...clientOptions,
  });
}

export function createGraphQLErrorMessage(
  graphQLError?: string | GraphQLError[]
): GraphQLError[] {
  if (graphQLError) {
    return typeof graphQLError === 'string'
      ? [new GraphQLError(graphQLError)]
      : graphQLError;
  }

  return [new GraphQLError('Unspecified error from ErrorProvider.')];
}

interface CreateMocksOptions<TData, TVariables> {
  data: TData;
  variables?: TVariables;
  newData?: ResultFunction<FetchResult>;
  delay?: number;
  graphqlErrors?: string | GraphQLError[];
  error?: Error;
}

export function createMocks<
  TData extends Record<string, any> | null | undefined,
  TVariables extends OperationVariables | undefined = OperationVariables
>(
  query: DocumentNode,
  {
    variables,
    data,
    newData,
    graphqlErrors,
    error,
    delay = 0,
  }: CreateMocksOptions<TData, TVariables>
): MockedResponse[] {
  return [
    {
      request: {
        query,
        variables,
      },
      ...(!error
        ? {
            result: {
              data,
              ...(graphqlErrors
                ? { errors: createGraphQLErrorMessage(graphqlErrors) }
                : {}),
            },
          }
        : {}),
      error,
      newData,
      delay,
    },
  ];
}
