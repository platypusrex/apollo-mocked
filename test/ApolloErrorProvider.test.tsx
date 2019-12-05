import React from 'react';
import { GraphQLError } from 'graphql';
import { render, wait, cleanup } from '@testing-library/react';
import { Component } from './Component';
import { ApolloErrorProvider } from '../src/ApolloErrorProvider';

describe('ApolloErrorProvider', () => {
  afterEach(cleanup);
  it('should render the default graphql error message', async () => {
    const { getByText } = render(
      <ApolloErrorProvider>
        <Component name="Buck" />
      </ApolloErrorProvider>
    );

    await wait(() => {
      expect(
        getByText('GraphQL error: Unspecified error from ErrorProvider.')
      ).toBeTruthy();
    });
  });

  it('should render a graphql error message with provided string', async () => {
    const { getByText } = render(
      <ApolloErrorProvider graphQLError="Dog not found.">
        <Component name="Buck" />
      </ApolloErrorProvider>
    );

    await wait(() => {
      expect(getByText('GraphQL error: Dog not found.')).toBeTruthy();
    });
  });

  it('should render a graphql error message with provided graphql error', async () => {
    const { getByText } = render(
      <ApolloErrorProvider graphQLError={[new GraphQLError('Dog not found.')]}>
        <Component name="Buck" />
      </ApolloErrorProvider>
    );

    await wait(() => {
      expect(getByText('GraphQL error: Dog not found.')).toBeTruthy();
    });
  });
});
