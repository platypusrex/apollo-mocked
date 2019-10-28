import React from 'react';
import { render, wait } from '@testing-library/react';
import { Component } from './Component';
import { ApolloErrorProvider } from '../src/ApolloErrorProvider';

describe('ApolloErrorProvider', () => {
  it('should render the error view', () => {
    const { getByText } = render(
      <ApolloErrorProvider>
        <Component name="Buck" />
      </ApolloErrorProvider>
    );

    wait(() => {
      expect(getByText('Error!')).toBeTruthy();
    });
  });
});
