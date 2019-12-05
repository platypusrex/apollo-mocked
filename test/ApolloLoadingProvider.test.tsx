import React from 'react';
import { render, wait, cleanup } from '@testing-library/react';
import { Component } from './Component';
import { ApolloLoadingProvider } from '../src/ApolloLoadingProvider';

describe('ApolloLoadingProvider', () => {
  afterEach(cleanup);
  it('should render the loading view', async () => {
    const { getByText } = render(
      <ApolloLoadingProvider>
        <Component name="Buck" />
      </ApolloLoadingProvider>
    );

    await wait(() => {
      expect(getByText('Loading...')).toBeTruthy();
    });
  });
});
