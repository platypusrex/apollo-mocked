import React from 'react';
import { render, screen } from '@testing-library/react';
import { ApolloLoadingProvider } from '../src/ApolloLoadingProvider';
import { Dog } from './Dog';

describe('ApolloLoadingProvider', () => {
  it('should render the loading view', async () => {
    render(
      <ApolloLoadingProvider>
        <Dog />
      </ApolloLoadingProvider>
    );

    expect(screen.getByText('Loading...')).toBeTruthy();
  });
});
