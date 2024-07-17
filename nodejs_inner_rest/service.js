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
    if (!req.body.originId) {
      return res.status(400).json({ message: 'missing: originId' });
    }

    if (!req.body.originName) {
      return res.status(400).json({ message: 'missing: originName' });
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
      .where('origin_id', req.body.originId)
      .first();

    if (exists) {
      return res
        .status(409)
        .json({ message: `Article ${req.body.originId} already exists` });
    }

    console.log(`Insert article ${req.body.originId}`);
    await knex('articles').insert({
      origin_id: req.body.originId.substring(0, 128),
      origin_name: req.body.originName.substring(0, 64),
      title: req.body.title.substring(0, 255),
      description: req.body.description.substring(0, 255),
      category: req.body.category.substring(0, 255).toLowerCase(),
      url: req.body.url,
    });
    processWordHits(req.body.originId, req.body.title);
    return res
      .status(201)
      .json({ message: `Article ${req.body.origin_id} created` });
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
}

async function processWordHits(originId, title) {
  // Remove special characters and split title into words
  const cleaned = title.replace(/[^a-öA-Ö0-9\s]/g, '');
  const exploded = cleaned.split(' ');

  // Count hits for each word
  const hits = {};
  exploded.forEach((word) => {
    if (word.length > 1) {
      word = word.substring(0, 64).toLowerCase();
      if (hits[word]) {
        hits[word] += 1;
      } else {
        hits[word] = 1;
      }
    }
  });

  // Insert hits into database
  const rows = [];
  for (const word in hits) {
    // console.log(`Insert word ${word} ${hits[word]}`);
    const exists = await knex('word_hits').where('word', word).first();

    if (exists) {
      console.log(`Update word ${word} with ${hits[word]}`);
      await knex('word_hits')
        .where('word', word)
        .update({
          hits: knex.raw('hits + 1'),
          updatedAt: knex.fn.now(),
        });
    } else {
      console.log(`Insert word ${word} with ${hits[word]}`);
      await knex('word_hits').insert({
        word: word.substring(0, 64),
        hits: hits[word],
      });
    }
  }
  // await knex('word_hits').insert(rows);
}
