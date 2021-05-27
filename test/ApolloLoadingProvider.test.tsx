import React from 'react';
import { render, screen } from '@testing-library/react';
import { Component } from './Component';
import { ApolloLoadingProvider } from '../src/ApolloLoadingProvider';

describe('ApolloLoadingProvider', () => {
  it('should render the loading view', async () => {
    render(
      <ApolloLoadingProvider>
        <Component />
      </ApolloLoadingProvider>
    );

    expect(screen.getByText('Loading...')).toBeTruthy();
  });
});
