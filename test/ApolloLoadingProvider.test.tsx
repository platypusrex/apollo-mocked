import React from 'react';
import { render, wait } from '@testing-library/react';
import { Component } from './Component';
import { ApolloLoadingProvider } from '../src/ApolloLoadingProvider';

describe('ApolloLoadingProvider', () => {
  it('should render the loading view', () => {
    const { getByText } = render(
      <ApolloLoadingProvider>
        <Component name="Buck" />
      </ApolloLoadingProvider>
    );

    wait(() => {
      expect(getByText('Loading...')).toBeTruthy();
    });
  });
});
