const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    bookCount: Number
    savedBooks: [Book]!
  }

  type Book {
    bookid: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    profile: User
  }
  
  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  input BookInput {
    authors: [String]!
    description: String!
    title: String!
    image: String
    link: String
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(input: UserInput!): Auth
    saveBook(input: BookInput!): User
    removeBook(bookid: String): User
  }
`;

export default typeDefs;
