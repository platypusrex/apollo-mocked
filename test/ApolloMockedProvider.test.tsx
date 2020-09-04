import React from 'react';
import { render, wait, cleanup } from '@testing-library/react';
import { Component, GET_DOG_QUERY } from './Component';
import { ApolloMockedProvider } from '../src/ApolloMockedProvider';
import { createMocks } from '../src/utils';

const name = 'Buck';
const breed = 'bulldog';
const mocks = createMocks(GET_DOG_QUERY, {
  data: {
    dog: { name, breed },
  },
});

describe('ApolloMockedProvider', () => {
  afterEach(cleanup);

  it('should render the requested data', async () => {
    const { getByText } = render(
      <ApolloMockedProvider mocks={mocks}>
        <Component />
      </ApolloMockedProvider>
    );

    await wait(() => {
      expect(getByText(`Buck is a ${breed}`)).toBeTruthy();
    });
  });
});
