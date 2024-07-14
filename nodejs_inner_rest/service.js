import knex from './knex.js';

export async function create() {
  const { name, value } = req.body;
  await knex('settings').insert({ origin_id: 123 });
  res.status(201).send();
}
