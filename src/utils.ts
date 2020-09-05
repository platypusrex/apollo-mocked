import fetch from 'isomorphic-unfetch';
import ApolloClient, {
  ApolloClientOptions,
  OperationVariables,
} from 'apollo-client';
import {
  MockedResponse,
  MockLink,
  ResultFunction,
} from '@apollo/react-testing';
import {
  InMemoryCache,
  InMemoryCacheConfig,
  NormalizedCacheObject,
} from 'apollo-cache-inmemory';
import { ApolloLink, DocumentNode, Observable, FetchResult } from 'apollo-link';
import {
  buildClientSchema,
  graphql,
  GraphQLError,
  GraphQLSchema,
  IntrospectionQuery,
  getIntrospectionQuery,
  print,
  printSchema,
} from 'graphql';
import {
  addMockFunctionsToSchema,
  addResolveFunctionsToSchema,
  ITypeDefinitions,
  IMocks,
  IResolvers,
} from 'graphql-tools';

export async function fetchGraphQLSchema(
  url: string,
  readable: boolean = true,
  init?: RequestInit
): Promise<ITypeDefinitions> {
  const headers = init ? init.headers : {};

  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({
      query: getIntrospectionQuery,
    }),
    ...init,
  })
    .then((res) => res.json())
    .then((schemaJSON) => {
      if (readable) {
        return printSchema(buildClientSchema(schemaJSON.data));
      }

      return JSON.stringify(schemaJSON, null, 2);
    });
}

function delay(ms: number): Promise<{}> {
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
  const delayMs = (options && options.delay) || 200;

  return new ApolloLink((operation) => {
    return new Observable((observer) => {
      const { query, operationName, variables } = operation;
      delay(delayMs)
        .then(() => {
          return graphql(
            schema,
            print(query),
            rootValue,
            context,
            variables,
            operationName
          );
        })
        .then((result) => {
          observer.next(result);
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
    return new Observable(() => {});
  });
}

export interface LinkSchemaProps extends CreateLinkOptions {
  resolvers: IMocks;
  introspectionResult: IntrospectionQuery | any;
  typeResolvers?: IResolvers;
  rootValue?: any;
  context?: any;
}

export interface CreateApolloClient {
  mocks: ReadonlyArray<MockedResponse> | LinkSchemaProps;
  cacheOptions?: InMemoryCacheConfig;
  clientOptions?: Partial<ApolloClientOptions<NormalizedCacheObject>>;
  addTypename?: boolean;
  links?: (cache?: InMemoryCache) => ApolloLink[];
}

export function createApolloClient({
  mocks,
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
      typeResolvers,
      rootValue,
      context,
      delay,
    } = mocks as LinkSchemaProps;

    const schema = buildClientSchema(introspectionResult as any);
    let mockOptions: any = { schema };

    mockOptions = {
      ...mockOptions,
      mocks: resolvers,
    };

    addMockFunctionsToSchema(mockOptions);

    if (!!typeResolvers) {
      addResolveFunctionsToSchema({ schema, resolvers: typeResolvers });
    }

    if (delay) {
      apolloLinkOptions.delay = delay;
    }

    mockLink = createMockLink(schema, rootValue, context, apolloLinkOptions);
  } else {
    mockLink = new MockLink(mocks as MockedResponse[], addTypename);
  }

  const cache = new InMemoryCache({ ...cacheOptions, addTypename });

  return new ApolloClient({
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

export function createMocks<TData, TVariables = OperationVariables>(
  query: DocumentNode,
  {
    variables,
    data,
    newData,
    graphqlErrors,
    error,
    delay = 200,
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
