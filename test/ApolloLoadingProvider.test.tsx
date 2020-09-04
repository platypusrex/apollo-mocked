import React from 'react';
import { render, wait, cleanup } from '@testing-library/react';
import { Component } from './Component';
import { ApolloLoadingProvider } from '../src/ApolloLoadingProvider';

describe('ApolloLoadingProvider', () => {
  afterEach(cleanup);
  it('should render the loading view', () => {
    const { getByText } = render(
      <ApolloLoadingProvider>
        <Component />
      </ApolloLoadingProvider>
    );

    wait(() => {
      expect(getByText('Loading...')).toBeTruthy();
    });
  });
});
