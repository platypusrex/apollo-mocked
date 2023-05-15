import React from 'react';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';
import { render, screen } from '@testing-library/react';
import { ApolloMockedProvider } from '../src/ApolloMockedProvider';
import { createMocks } from '../src/utils';
import { Dog } from './Dog';
import { Human } from './Human';
import { NetworkError } from './NetworkError';
import { HUMAN_QUERY } from './gql/humanQuery';
import introspectionResult from './introspection.json';
import { HumanQuery, HumanQueryVariables } from './generated';

const name = 'Buck';
const breed = 'bulldog';
const age = 99;
const mocks = createMocks<HumanQuery, HumanQueryVariables>(HUMAN_QUERY, {
  data: {
    human: { name, age },
  },
});

describe('ApolloMockedProvider', () => {
  describe('mocked operations', () => {
    it('should render the requested data', async () => {
      render(
        <ApolloMockedProvider mocks={mocks}>
          <Human />
        </ApolloMockedProvider>
      );

      expect(await screen.findByText(`${name} is ${age} years old.`)).toBeTruthy();
    });
  });

  describe('mocked resolvers', () => {
    it('should render the requested data', async () => {
      render(
        <ApolloMockedProvider
          mocks={{
            resolvers: {
              Query: {
                dog: () => ({ name, breed }),
              },
            },
            introspectionResult,
          }}
        >
          <Dog />
        </ApolloMockedProvider>
      );

      expect(await screen.findByText(`${name} is a ${breed}`)).toBeTruthy();
    });
    it('should render a graphql error', async () => {
      render(
        <ApolloMockedProvider
          mocks={{
            introspectionResult,
            resolvers: {
              Query: {
                dog: () => {
                  throw new ApolloError({
                    graphQLErrors: [new GraphQLError('Dog not found.')],
                  });
                },
              },
            },
          }}
        >
          <Dog />
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
              Query: {
                dog: () => {
                  throw new ApolloError({
                    networkError: new Error('service unavailable'),
                  });
                },
              },
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
