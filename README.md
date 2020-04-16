# apollo-mocked

A mocked ApolloProvider solution that works equally well with Storybook and unit testing react components.

## Install

`npm install apollo-mocked`
or
`yarn add apollo-mocked`

## Features

Written in typescript, the `apollo-mocked` packages exposes 3 components for testing loading, error, and final states.<br>
**All examples below will assume the following component:**

```
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const GET_DOG_QUERY = gql`
  query getDog($name: String) {
    dog(name: $name) {
      id
      name
      breed
    }
  }
`;

export interface DogComponentProps {
  name: string;
}

export const DogComponent: React.FC<DogComponentProps> = ({ name }) => {
  const { data, loading, error } = useQuery(GET_DOG_QUERY, { variables: name });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <p>
      {data.dog.name} is a {data.dog.breed}
    </p>
  );
};
```

## Components

All components take an optional `Provider` prop which will generally default to the latest `ApolloProvider` from `@apollo/react-hooks`. If your using a different version you will probably need to pass an instance of `ApolloProvider` to each component.

### **`ApolloLoadingProvider`**

| property | propType                   | required | default                                           |
| -------- | -------------------------- | -------- | ------------------------------------------------- |
| Provider | `React.ComponentType<any>` | no       | `<ApolloProvider />` (@apollo/react-hooks v3.1.5) |

##### testing example

```
import React from 'react';
import { cleanup, render, wait } from '@testing-library/react';
import { ApolloLoadingProvider } from 'apollo-mocked';
import { DogComponent } from './';

describe('Dog', () => {
  afterEach(cleanup);

  it('should render loading component', async () => {
    const loadingText = 'Loading...';

    const { getByText } = render(
      <ApolloLoadingProvider>
        <DogComponent name="Fido" />
      </ApolloLoadingProvider>
    );

    await wait(() => {
      const loadingNode = getByText(loadingText);
      expect(loadingNode).toBeInTheDocument();
      expect(loadingNode).toHaveTextContent(new RegExp(`^${loadingText}$`));
    });
  });
});
```

##### storybook example

```
import React from 'react';
import { storiesOf } from '@storybook/react';
import { ApolloLoadingProvider } from 'apollo-mocked';
import { DogComponent } from './';

const usersStories = storiesOf('Users', module);

usersStories.add('loading', () => (
  <ApolloLoadingProvider>
    <DogComponent name="Fido" />
  </ApolloLoadingProvider>
));
```

### **`ApolloErrorProvider`**

| property      | propType                   | required | default                                                       |
| ------------- | -------------------------- | -------- | ------------------------------------------------------------- |
| Provider      | `React.ComponentType<any>` | no       | `<ApolloProvider />` (@apollo/react-hooks v3.1.5)             |
| errorMessages | `string` or `string[]`     | no       | `[new GraphQLError('Unspecified error from ErrorProvider.')]` |

##### testing example

```
import React from 'react';
import { cleanup, render, wait } from '@testing-library/react';
import { ApolloErrorProvider } from 'apollo-mocked';
import { DogComponent } from './';

describe('Dog', () => {
  afterEach(cleanup);

  it('should render error component', async () => {
      const errorMessage = 'Failed to fetch dog.';
      const errorRes = `GraphQL error: ${errorMessage}`;

      const { getByText } = render((
        <ApolloErrorProvider errorMessages={errorMessage}>
          <DogComponent name="Fido" />
        </ApolloErrorProvider>
      ));

      await wait(() => {
        const errorNode = getByText(errorRes);
        expect(errorNode).toBeInTheDocument();
        expect(errorNode).toHaveTextContent(new RegExp(`^${errorRes}$`));
      });
    });
  )}
});
```

##### storybook example

```
import React from 'react';
import { storiesOf } from '@storybook/react';
import { ApolloErrorProvider } from 'apollo-mocked';
import { DogComponent } from './';

const usersStories = storiesOf('Dogs', module);

usersStories.add('error', () => (
  <ApolloErrorProvider>
    <DogComponent name="Fido" />
  </ApolloErrorProvider>
));
```

### **`ApolloMockedProvider`**

| property      | propType                                             | required | default                                           |
| ------------- | ---------------------------------------------------- | -------- | ------------------------------------------------- |
| Provider      | `React.ComponentType<any>`                           | no       | `<ApolloProvider />` (@apollo/react-hooks v3.1.5) |
| addTypename   | boolean                                              | no       | false                                             |
| cacheOptions  | `InMemoryCacheConfig`                                | no       | --                                                |
| clientOptions | `ApolloClientOptions<NormalizedCacheObject>`         | no       | --                                                |
| mocks         | `ReadonlyArray<MockedResponse>` or `LinkSchemaProps` | yes      | --                                                |

`linkSchemaProps`

| property            | propType             | required | default |
| ------------------- | -------------------- | -------- | ------- |
| introspectionResult | `IntrospectionQuery` | yes      | --      |
| resolvers           | `IMocks`             | yes      | --      |
| typeResolvers       | `IResolvers`         | no       | --      |

##### mocks prop options

- using the `MockedResponse` type

```
const mocks = [
  {
    request: {
      query: GET_DOG_QUERY,
      variables: {
        name: 'Fido',
      },
    },
    result: {
      data: {
        dog: { id: '1', name: 'Fido', breed: 'bulldog' },
      },
    },
  },
];
```

- using the `IMocks` type

**Note:** the `typeDefs` const below can also be a json file (result of introspecting schema)

```
const typeDefs = gql`
  type Query {
    hello: String
    resolved: String
  }
`;

const resolvers = {
  Query: {
    getDog: () => {
      id: '1',
      name: 'Fido',
      breed: 'bulldog'
    },
  },
};

const mocks = {
  introspectionResult: typeDefs,
  resolvers,
};
```

##### testing example

```
import React from 'react';
import { cleanup, render, wait } from '@testing-library/react';
import { ApolloMockedProvider } from 'apollo-mocked';
import { mocks } from './example-above';
import { DogComponent } from './';

describe('Dog', () => {
  afterEach(cleanup);

  it('should render error component', async () => {
      const dogName = 'Fido';

      const { getByText } = render((
        <ApolloMockedProvider mocks={mocks}>
          <DogComponent name="Fido" />
        </ApolloErrorProvider>
      ));

      await wait(() => {
        const dogNameNode = getByText(dogName);
        expect(dogNameNode).toBeInTheDocument();
        expect(dogNameNode).toHaveTextContent(new RegExp(`^${dogName}$`));
      });
    });
  )}
});
```

##### storybook example

```
import React from 'react';
import { storiesOf } from '@storybook/react';
import { ApolloMockedProvider } from 'apollo-mocked';
import { mocks } from './example-above';
import { DogComponent } from './';

const usersStories = storiesOf('Dogs', module);

usersStories.add('mocked', () => (
  <ApolloMockedProvider mocks={mocks}>
    <DogComponent name="Fido" />
  </ApolloMockedProvider>
));
```
