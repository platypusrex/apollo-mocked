import gql from 'graphql-tag';

export const DOG_FRAGMENT = gql`
  fragment Dog on Dog {
    name @include(if: $includeName)
    breed
  }
`;
