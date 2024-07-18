const environment = process.env.ENVIRONMENT || 'development';
import knex from 'knex';
import config from './knexfile.js';
export default knex(config[environment]);
