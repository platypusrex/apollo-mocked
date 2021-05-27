import React from 'react';
import { render, screen } from '@testing-library/react';
import { Component, GET_DOG_QUERY } from './Component';
import { NetworkError } from './NetworkError';
import { ApolloMockedProvider } from '../src/ApolloMockedProvider';
import { createMocks } from '../src/utils';
import introspectionResult from './schema.json';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';

const name = 'Buck';
const breed = 'bulldog';
const mocks = createMocks(GET_DOG_QUERY, {
  data: {
    dog: { name, breed },
  },
});

describe('ApolloMockedProvider', () => {
  describe('mocked operations', () => {
    it('should render the requested data', async () => {
      render(
        <ApolloMockedProvider mocks={mocks}>
          <Component />
        </ApolloMockedProvider>
      );

      expect(await screen.findByText(`Buck is a ${breed}`)).toBeTruthy();
    });
  });

  describe('mocked resolvers', () => {
    it('should render the requested data', async () => {
      render(
        <ApolloMockedProvider
          mocks={{
            resolvers: {
              Query: () => ({
                dog: () => ({ name, breed }),
              }),
            },
            introspectionResult,
          }}
        >
          <Component />
        </ApolloMockedProvider>
      );

      expect(await screen.findByText(`Buck is a ${breed}`)).toBeTruthy();
    });
    it('should render a graphql error', async () => {
      render(
        <ApolloMockedProvider
          mocks={{
            introspectionResult,
            resolvers: {
              Query: () => ({
                dog: () => {
                  throw new ApolloError({
                    graphQLErrors: [new GraphQLError('Dog not found.')],
                  });
                },
              }),
            },
          }}
        >
          <Component />
        </ApolloMockedProvider>
      );

      expect(await screen.findByText('Dog not found.')).toBeTruthy();
    });
    it('should render a network error', async () => {
      render(
        <ApolloMockedProvider
          mocks={{
            introspectionResult,
            resolvers: {
              Query: () => ({
                dog: () => {
                  throw new ApolloError({
                    networkError: new Error('service unavailable'),
                  });
                },
              }),
            },
          }}
        >
          <NetworkError />
        </ApolloMockedProvider>
      );

      expect(await screen.findByText('service unavailable')).toBeTruthy();
    });
  });
});
