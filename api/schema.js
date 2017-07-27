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
    imageurl: String
    tags: [String]
    itemowner: User!
    createdon: Int!
    available: Boolean!
    borrower: User
  }

  type Tag {
    title: String!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    items: [Item]
    item(id: ID!): Item
    tags: [Tag]
  }

  type Mutation {
    addItem(
      title: String!
      description: String!
      imageurl: String!
      itemowner: ID!
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