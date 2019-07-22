import ApolloClient from 'apollo-client';
import { InMemoryCache, InMemoryCacheConfig } from 'apollo-cache-inmemory';
import { ApolloLink, Observable } from 'apollo-link';
import {
  buildClientSchema,
  graphql,
  GraphQLError,
  GraphQLSchema,
  introspectionQuery,
  print,
  printSchema,
} from 'graphql';
import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
  addResolveFunctionsToSchema,
  ITypeDefinitions,
  IMocks,
  IResolverValidationOptions,
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
      query: introspectionQuery,
    }),
    ...init,
  })
    .then(res => res.json())
    .then(schemaJSON => {
      if (readable) {
        return printSchema(buildClientSchema(schemaJSON.data));
      }

      return JSON.stringify(schemaJSON, null, 2);
    });
}

function delay(ms: number): Promise<{}> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

interface CreateLinkOptions {
  delayMs?: number;
}

function createMockLink(
  schema: GraphQLSchema,
  rootValue = {},
  context = {},
  options: CreateLinkOptions = {}
): ApolloLink {
  const delayMs = (options && options.delayMs) || 300;
  return new ApolloLink(operation => {
    return new Observable(observer => {
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
        .then(result => {
          observer.next(result);
          observer.complete();
        })
        .catch(observer.error.bind(observer));
    });
  });
}

export function createErrorLink(errorMessages?: string | string[]): ApolloLink {
  return new ApolloLink(() => {
    return new Observable(observer => {
      delay(100)
        .then(() => {
          observer.next({
            errors: createGraphQLErrorMessage(errorMessages),
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

interface CreateApolloClient {
  typeDefs: ITypeDefinitions;
  mocks: IMocks;
  resolverValidationOptions?: IResolverValidationOptions;
  typeResolvers?: IResolvers;
  rootValue?: any;
  context?: any;
  cacheOptions?: InMemoryCacheConfig;
  apolloClientOptions?: any;
  apolloLinkOptions?: CreateLinkOptions;
  links?: (cache?: InMemoryCache) => ApolloLink[] | ApolloLink[];
}

export function createApolloClient({
  typeDefs,
  mocks,
  resolverValidationOptions,
  typeResolvers,
  rootValue = {},
  context = {},
  cacheOptions = {},
  apolloClientOptions = {},
  apolloLinkOptions = {},
  links = () => {
    return [];
  },
}: CreateApolloClient) {
  const schema = makeExecutableSchema({ typeDefs, resolverValidationOptions });

  let mockOptions: any = { schema };

  if (!!mocks) {
    mockOptions = {
      ...mockOptions,
      mocks,
    };

    addMockFunctionsToSchema(mockOptions);
  }

  if (!!typeResolvers) {
    addResolveFunctionsToSchema({ schema, resolvers: typeResolvers });
  }

  const cache = new InMemoryCache(cacheOptions);

  return new ApolloClient({
    addTypename: true,
    cache,
    link: ApolloLink.from([
      ...links(cache),
      createMockLink(schema, rootValue, context, apolloLinkOptions),
    ]),
    ...apolloClientOptions,
  });
}

export function createGraphQLErrorMessage(
  messages?: string | string[]
): GraphQLError[] {
  if (!messages) {
    return [new GraphQLError('Unspecified error from ErrorProvider.')];
  }

  const errorMessages = Array.isArray(messages) ? [...messages] : [messages];

  return errorMessages.map(message => new GraphQLError(message));
}