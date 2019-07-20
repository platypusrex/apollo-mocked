import { buildClientSchema, introspectionQuery, printSchema } from 'graphql';
import { ITypeDefinitions } from 'graphql-tools';

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
