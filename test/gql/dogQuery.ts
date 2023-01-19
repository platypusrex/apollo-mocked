import gql from 'graphql-tag';

export const DOG_QUERY = gql`
  query Dog($includeName: Boolean = true) {
    dog {
      name @include(if: $includeName)
      breed
    }
  }
`;
