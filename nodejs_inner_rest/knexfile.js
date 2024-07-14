// Update with your config settings.
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const dbHost = process.env.MYSQL_CONTAINER_HOST;
const dbPort = process.env.MYSQL_CONTAINER_PORT;
const dbName = process.env.MYSQL_CONTAINER_DATABASE;
const dbUser = process.env.MYSQL_CONTAINER_USER;
const dbPassword = process.env.MYSQL_CONTAINER_PASSWORD;

export default {
  development: {
    client: 'mysql2',
    connection: {
      host: dbHost,
      port: dbPort,
      database: dbName,
      user: dbUser,
      password: dbPassword,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'inner_knex_migrations',
    },
  },
};
