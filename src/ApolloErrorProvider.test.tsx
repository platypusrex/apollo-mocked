import React from 'react';
import { render, wait } from '@testing-library/react';
import { TestComponent } from '../test/TestComponent';
import { ApolloErrorProvider } from './ApolloErrorProvider';

describe('ApolloErrorProvider', () => {
  it('should render the error view', () => {
    const { getByText } = render(
      <ApolloErrorProvider>
        <TestComponent name="Bilbo" />
      </ApolloErrorProvider>
    );

    wait(() => {
      expect(getByText('Error!')).toBeTruthy();
    });
  });
});
