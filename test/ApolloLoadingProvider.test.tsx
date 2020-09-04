import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Component } from './Component';
import { ApolloLoadingProvider } from '../src';

describe('ApolloLoadingProvider', () => {
  it('should render the loading view', () => {
    const { getByText } = render(
      <ApolloLoadingProvider>
        <Component />
      </ApolloLoadingProvider>
    );

    waitFor(() => {
      expect(getByText('Loading...')).toBeTruthy();
    });
  });
});
