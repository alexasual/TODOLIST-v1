const { Pool } = require('pg');
const { faker } = require('@faker-js/faker');

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: "blogsite_user",
  password: process.env.POSTGRES_PASSWORD,
});

const insertRandomPosts = async (count) => {
  for (let i = 0; i < count; i++) {
    const title = faker.lorem.sentence();
    const content = faker.lorem.paragraphs();
    await pool.query(
      'INSERT INTO posts (title, content) VALUES ($1, $2)',
      [title, content]
    );
  }
  console.log(`${count} random posts inserted.`);
};

const main = async () => {
  try {
    await insertRandomPosts(100);
  } catch (err) {
    console.error('Error inserting random posts:', err);
  } finally {
    await pool.end();
  }
};

main();