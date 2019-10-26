import React from 'react';
import { render, wait } from '@testing-library/react';
import { ApolloMockedProvider } from './ApolloMockedProvider';
import { TestComponent, GET_DOG_QUERY } from '../test/TestComponent';

describe('ApolloMockedProvider', () => {
  const name = 'Buck';
  const breed = 'bulldog';

  const mocks = [
    {
      request: {
        query: GET_DOG_QUERY,
        variables: {
          name,
        },
      },
      result: {
        data: {
          dog: { id: '1', name, breed },
        },
      },
    },
  ];

  it('should render the loading view', () => {
    wait(() => {
      const { getByText } = render(
        <ApolloMockedProvider mocks={mocks}>
          <TestComponent name={name} />
        </ApolloMockedProvider>
      );

      expect(getByText('Loading...')).toBeTruthy();
    });
  });

  it('should render the requested data', () => {
    const { getByText } = render(
      <ApolloMockedProvider mocks={mocks}>
        <TestComponent name={name} />
      </ApolloMockedProvider>
    );

    wait(() => {
      expect(getByText(`Buck is a ${breed}`)).toBeTruthy();
    });
  });

  it('should render the error view', () => {
    const { getByText } = render(
      <ApolloMockedProvider mocks={mocks}>
        <TestComponent name="Bilbo" />
      </ApolloMockedProvider>
    );

    wait(() => {
      expect(getByText('Error!')).toBeTruthy();
    });
  });
});
