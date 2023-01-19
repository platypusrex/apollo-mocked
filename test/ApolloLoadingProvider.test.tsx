import React from 'react';
import { render, screen } from '@testing-library/react';
import { Dog } from './Dog';
import { ApolloLoadingProvider } from '../src/ApolloLoadingProvider';

describe.skip('ApolloLoadingProvider', () => {
  it('should render the loading view', async () => {
    render(
      <ApolloLoadingProvider>
        <Dog />
      </ApolloLoadingProvider>
    );

    expect(screen.getByText('Loading...')).toBeTruthy();
  });
});
