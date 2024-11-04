const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    posts: [Post]
    post(id: ID!): Post
    me: User
  }

  type Mutation {
    addPost(title: String!, content: String!): Post
    deletePost(id: ID!): Boolean
    register(username: String!, password: String!): AuthPayload
    login(username: String!, password: String!): AuthPayload
  }

  type Post {
    id: ID!
    title: String!
    content: String!
  }

  type User {
    id: ID!
    username: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;

module.exports = typeDefs;