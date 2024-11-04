const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    posts: async (_, __, { pool }) => {
      const res = await pool.query('SELECT * FROM posts');
      return res.rows;
    },
    post: async (_, { id }, { pool }) => {
      const res = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
      return res.rows[0];
    },
    me: (_, __, { user }) => user,
  },
  Mutation: {
    addPost: async (_, { title, content }, { pool }) => {
      const res = await pool.query(
        'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *',
        [title, content]
      );
      return res.rows[0];
    },
    deletePost: async (_, { id }, { pool }) => {
      await pool.query('DELETE FROM posts WHERE id = $1', [id]);
      return true;
    },
    register: async (_, { username, password }, { pool }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const res = await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
        [username, hashedPassword]
      );
      const newUser = res.rows[0];
      const token = jwt.sign({ userId: newUser.id }, 'your-secret-key');
      return { ...newUser, token };
    },
    login: async (_, { username, password }, { pool }) => {
      const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = res.rows[0];
      if (!user) {
        throw new Error('User not found');
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Invalid password');
      }
      const token = jwt.sign({ userId: user.id }, 'your-secret-key');
      return { ...user, token };
    },
  },
};

module.exports = resolvers;