import React from 'react';
import { GraphQLError } from 'graphql';
import { render, screen, waitFor } from '@testing-library/react';
import { Component } from './Component';
import { ApolloErrorProvider } from '../src/ApolloErrorProvider';

describe('ApolloErrorProvider', () => {
  it('should render the default graphql error message', async () => {
    render(
      <ApolloErrorProvider>
        <Component />
      </ApolloErrorProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Unspecified error from ErrorProvider.')
      ).toBeTruthy();
    });
  });

  it('should render a graphql error message with provided string', async () => {
    render(
      <ApolloErrorProvider graphQLError="Dog not found.">
        <Component />
      </ApolloErrorProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Dog not found.')).toBeTruthy();
    });
  });

  it('should render a graphql error message with provided graphql error', async () => {
    render(
      <ApolloErrorProvider graphQLError={[new GraphQLError('Dog not found.')]}>
        <Component />
      </ApolloErrorProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Dog not found.')).toBeTruthy();
    });
  });
});
