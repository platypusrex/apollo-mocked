import gql from 'graphql-tag';

export const HUMAN_QUERY = gql`
  query Human {
    human {
      name
      age
    }
  }
`;
