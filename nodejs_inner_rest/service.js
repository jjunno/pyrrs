import knex from './knex.js';

export async function create(req, res) {
  const t = req.body;
  await knex('articles').insert({ origin_id: 123 });
  res.status(201).send();
}
