import { gql } from '@apollo/client';

//fix

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

//fix

export const ADD_USER = gql`
  mutation addUser($input: UserInput!) {
    addUser(input: $input) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($bookData: BookInput!) {
    saveBook(bookData: $bookData) {
      _id
      savedBooks {
        bookId
        authors
        image
        description
        title
        link
      }
    }
  }
`;

//fix
export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(title: $bookId) {
      _id
      bookId
    }
  }
`;