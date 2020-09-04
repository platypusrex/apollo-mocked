# apollo-mocked

A mocked ApolloProvider solution that works equally well with Storybook and unit testing react components.

**important:**
<br/>Versions 0.4.8+ are unstable as regressions from apollo v3 are still being ironed out

You can still use v0.4.7 with apollo v3 by passing the `Provider` to each mock provider

## Install

`npm install apollo-mocked`
or
`yarn add apollo-mocked`

## Features

Written in typescript, the `apollo-mocked` packages exposes 3 components for testing loading, error, and mocked data.<br>
**All examples below will assume the following component:**

```jsx
import React from 'react';
import { useQuery } from '@apollo/client';
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

| property | propType                   | required | default                                      |
| -------- | -------------------------- | -------- | -------------------------------------------- |
| Provider | `React.ComponentType<any>` | no       | `<ApolloProvider />` (@apollo/client v3.1.4) |

##### testing example

```jsx
import React from 'react';
import { screen } from '@testing-library/react';
import { ApolloLoadingProvider } from 'apollo-mocked';
import { DogComponent } from './';

describe('Dog', () => {
  it('should render loading component', async () => {
    const loadingText = 'Loading...';

    render(
      <ApolloLoadingProvider>
        <DogComponent name="Fido" />
      </ApolloLoadingProvider>
    );

    const loadingNode = await screen.queryByText(loadingText);
    expect(loadingNode).toBeInTheDocument();
    expect(loadingNode).toHaveTextContent(new RegExp(`^${loadingText}$`));
  });
});
```

##### storybook example

```jsx
import React from 'react';
import { ApolloLoadingProvider } from 'apollo-mocked';
import { DogComponent } from './';

export default {
  title: 'Dogs',
  component: DogComponent,
};

export const Loading = () => (
  <ApolloLoadingProvider>
    <DogComponent name="Fido" />
  </ApolloLoadingProvider>
);
```

### **`ApolloErrorProvider`**

| property      | propType                   | required | default                                                       |
| ------------- | -------------------------- | -------- | ------------------------------------------------------------- |
| Provider      | `React.ComponentType<any>` | no       | `<ApolloProvider />` (@apollo/client v3.1.4)                  |
| errorMessages | `string` or `string[]`     | no       | `[new GraphQLError('Unspecified error from ErrorProvider.')]` |

##### testing example

```jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ApolloErrorProvider } from 'apollo-mocked';
import { DogComponent } from './';

describe('Dog', () => {
  it('should render error component', async () => {
    const errorMessage = 'Failed to fetch dog.';

    render(
      <ApolloErrorProvider errorMessages={errorMessage}>
        <DogComponent name="Fido" />
      </ApolloErrorProvider>
    );

    await wait(() => {
      const errorNode = screen.getByText(errorMessage);
      expect(errorNode).toBeInTheDocument();
      expect(errorNode).toHaveTextContent(new RegExp(`^${errorMessage}$`));
    });
  });
});
```

##### storybook example

```jsx
import React from 'react';
import { ApolloErrorProvider } from 'apollo-mocked';
import { DogComponent } from './';

export default {
  title: 'Dogs',
  component: DogComponent,
};

export const Error = () => (
  <ApolloErrorProvider>
    <DogComponent name="Fido" />
  </ApolloErrorProvider>
);
```

### **`ApolloMockedProvider`**

| property      | propType                                             | required | default                                      |
| ------------- | ---------------------------------------------------- | -------- | -------------------------------------------- |
| Provider      | `React.ComponentType<any>`                           | no       | `<ApolloProvider />` (@apollo/client v3.1.4) |
| addTypename   | boolean                                              | no       | false                                        |
| cacheOptions  | `InMemoryCacheConfig`                                | no       | --                                           |
| clientOptions | `ApolloClientOptions<NormalizedCacheObject>`         | no       | --                                           |
| mocks         | `ReadonlyArray<MockedResponse>` or `LinkSchemaProps` | yes      | --                                           |

`linkSchemaProps`

| property            | propType             | required | default |
| ------------------- | -------------------- | -------- | ------- |
| introspectionResult | `IntrospectionQuery` | yes      | --      |
| resolvers           | `IMocks`             | yes      | --      |
| typeResolvers       | `IResolvers`         | no       | --      |

##### mocks prop options

- using the `MockedResponse` type

```javascript
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

- using the `createMocks` util (outputs `MockedResponse[]` like above)

```typescript
import { createMocks } from 'apollo-mocked';
import { DOG_QUERY } from './dogQuery';

export const dogMocks = createMocks<DogQuery, DogQueryVariables>(DOG_QUERY, {
  data: {
    dog: { id: '1', name: 'Fido', breed: 'bulldog' },
  },
  variables: { name: 'Fido' },
});
```

- using the `IMocks` type

**Note:** the `typeDefs` const below can also be a json file (result of introspecting schema)

```javascript
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

```jsx
import React from 'react';
import { render, screen, wait } from '@testing-library/react';
import { ApolloMockedProvider } from 'apollo-mocked';
import { mocks } from './example-above';
import { DogComponent } from './';

describe('Dog', () => {
  it('should render the dog name', async () => {
    const dogName = 'Fido';

    render(
      <ApolloMockedProvider mocks={mocks}>
        <DogComponent name="Fido" />
      </ApolloErrorProvider>
    );

    await wait(() => {
      const dogNameNode = screen.getByText(dogName);
      expect(dogNameNode).toBeInTheDocument();
      expect(dogNameNode).toHaveTextContent(new RegExp(`^${dogName}$`));
    });
  });
});
```

##### storybook example

```jsx
import React from 'react';
import { ApolloMockedProvider } from 'apollo-mocked';
import { mocks } from './example-above';
import { DogComponent } from './';

export default {
  title: 'Dogs',
  component: DogComponent,
};

export const DogName = () => (
  <ApolloMockedProvider mocks={mocks}>
    <DogComponent name="Fido" />
  </ApolloMockedProvider>
));
```
