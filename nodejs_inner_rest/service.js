import knex from './knex.js';

export async function create(req, res) {
  try {
    // console.log(req.body);

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

    if (!req.body.date) {
      return res.status(400).json({ message: 'missing: date' });
    }

    const exists = await knex('articles')
      .where('origin_id', req.body.origin_id)
      .first();

    if (exists) {
      return res.status(409).json({ message: 'article already exists' });
    }
    console.log(req.body);
    await knex('articles').insert({
      origin_id: req.body.origin_id,
      origin_name: req.body.origin_name.substring(0, 64),
      title: req.body.title.substring(0, 255),
      description: req.body.description.substring(0, 255),
      category: req.body.category.substring(0, 255),
      url: req.body.url,
      image_url: req.body.image_url,
      date: req.body.date,
    });
    return res.status(201).send();
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
}
