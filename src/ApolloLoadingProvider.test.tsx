import React from 'react';
import { render, wait } from '@testing-library/react';
import { TestComponent } from '../test/TestComponent';
import { ApolloLoadingProvider } from './ApolloLoadingProvider';

describe('ApolloLoadingProvider', () => {
  it('should render the loading view', () => {
    wait(() => {
      const { getByText } = render(
        <ApolloLoadingProvider>
          <TestComponent name="Buck" />
        </ApolloLoadingProvider>
      );

      expect(getByText('Loading...')).toBeTruthy();
    });
  });
});
