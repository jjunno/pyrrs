import knex from './knex.js';

/**
 * Get the top 50 words with the most hits.
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
export async function getWords(req, res) {
  try {
    const limit = 50;
    const arr = await knex('word_hits')
      .where('ignore', false)
      .orderBy('hits', 'desc')
      .limit(limit);

    return res.status(200).json({
      data: arr,
      limit: limit,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
}
