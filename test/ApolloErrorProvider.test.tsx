import React from 'react';
import { GraphQLError } from 'graphql';
import { render, screen } from '@testing-library/react';
import { Dog } from './Dog';
import { ApolloErrorProvider } from '../src/ApolloErrorProvider';

describe.skip('ApolloErrorProvider', () => {
  it('should render the default graphql error message', async () => {
    render(
      <ApolloErrorProvider>
        <Dog />
      </ApolloErrorProvider>
    );

    expect(
      await screen.findByText('Unspecified error from ErrorProvider.')
    ).toBeTruthy();
  });

  it('should render a graphql error message with provided string', async () => {
    render(
      <ApolloErrorProvider graphQLError="Dog not found.">
        <Dog />
      </ApolloErrorProvider>
    );

    expect(await screen.findByText('Dog not found.')).toBeTruthy();
  });

  it('should render a graphql error message with provided graphql error', async () => {
    render(
      <ApolloErrorProvider graphQLError={[new GraphQLError('Dog not found.')]}>
        <Dog />
      </ApolloErrorProvider>
    );

    expect(await screen.findByText('Dog not found.')).toBeTruthy();
  });
});
