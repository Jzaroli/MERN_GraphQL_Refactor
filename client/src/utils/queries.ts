import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  query me {
    me {
        _id: ID
        username: String
        email: String
        password: String
        bookCount: Number
        savedBooks: [Book]!
    }
  }
`;