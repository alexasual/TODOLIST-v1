const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createClient } = require('redis');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();

const redisClient = createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

const getUser = (token) => {
  try {
    if (token) {
      return jwt.verify(token, 'your-secret-key');
    }
    return null;
  } catch (err) {
    return null;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    const user = getUser(token);
    return { user, pool };
  },
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
);