import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Component, GET_DOG_QUERY } from './Component';
import { ApolloMockedProvider, createMocks } from '../src';

const name = 'Buck';
const breed = 'bulldog';
const mocks = createMocks(GET_DOG_QUERY, {
  data: {
    dog: { name, breed },
  },
});

describe('ApolloMockedProvider', () => {
  it('should render the requested data', async () => {
    const { getByText } = render(
      <ApolloMockedProvider mocks={mocks}>
        <Component />
      </ApolloMockedProvider>
    );

    await waitFor(() => {
      expect(getByText(`Buck is a ${breed}`)).toBeTruthy();
    });
  });
});
