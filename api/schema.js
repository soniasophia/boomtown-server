import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
  type User {
    id: ID!
    email: String!
    fullname: String!
    bio: String
    items: [Item]
    borrowed: [Item]
  }

  type Item {
    id: ID!
    title: String!
    description: String!
    imageUrl: String
    tags: [String]
    itemOwner: User!
    createdOn: Int!
    available: Boolean!
    borrower: User
  }

  type Query {
    users: [User]
    user(id: ID!): User
    items: [Item]
    item(id: ID!): Item
  }

  type Mutation {
    addItem(
      title: String!
      description: String!
      imageUrl: String!
      itemOwner: ID!
      tags: [String]!
    ): Item

    addUser(
      fullname: String!
      email: String!
      bio: String
      password: String!
    ): User
  }
`;

export default makeExecutableSchema({
  typeDefs,
  resolvers
});