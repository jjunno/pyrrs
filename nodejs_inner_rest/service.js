import knex from './knex.js';

/**
 * Create new article row.
 *
 * Request from python_rss_reader.feed_item.py.
 *
 * @param {*} req
 * @param {*} res
 * @returns {Promise<void>}
 */
export async function create(req, res) {
  try {
    if (!req.body.origin_id) {
      return res.status(400).json({ message: 'missing: origin_id' });
    }

    if (!req.body.origin_name) {
      return res.status(400).json({ message: 'missing: origin_name' });
    }

    if (!req.body.title) {
      return res.status(400).json({ message: 'missing: title' });
    }

    if (!req.body.description) {
      return res.status(400).json({ message: 'missing: description' });
    }

    if (!req.body.category) {
      return res.status(400).json({ message: 'missing: category' });
    }

    if (!req.body.url) {
      return res.status(400).json({ message: 'missing: url' });
    }

    const exists = await knex('articles')
      .where('origin_id', req.body.origin_id)
      .first();

    if (exists) {
      return res
        .status(409)
        .json({ message: `Article ${req.body.origin_id} already exists` });
    }

    console.log(`Insert article ${req.body.origin_id}`);
    await knex('articles').insert({
      origin_id: req.body.origin_id.substring(0, 128),
      origin_name: req.body.origin_name.substring(0, 64),
      title: req.body.title.substring(0, 255),
      description: req.body.description.substring(0, 255),
      category: req.body.category.substring(0, 255).toLowerCase(),
      url: req.body.url,
    });
    return res
      .status(201)
      .json({ message: `Article ${req.body.origin_id} created` });
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
}
