const config = {
  overwrite: true,
  schema: 'test/schema.graphql',
  documents: 'test/gql/**/*.ts',
  emitLegacyCommonJSImports: false,
  generates: {
    './test/generated/types.ts': {
      plugins: ['typescript', 'typescript-operations'],
    },
    './test/generated/introspection.json': {
      plugins: ['introspection'],
    },
  },
};

module.exports = config;
