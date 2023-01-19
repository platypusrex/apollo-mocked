import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'test/schema.graphql',
  documents: 'test/gql/**/*.ts',
  generates: {
    './test/generated.ts': {
      plugins: ['typescript', 'typescript-operations'],
    },
    './test/introspection.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
