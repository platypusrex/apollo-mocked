import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
  it('should render the requested data', async () => {
    render(
      <ApolloMockedProvider mocks={mocks}>
        <Component />
      </ApolloMockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(`Buck is a ${breed}`)).toBeTruthy();
    });
  });
});
