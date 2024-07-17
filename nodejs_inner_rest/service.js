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
      .where('originId', req.body.originId)
      .first();

    if (exists) {
      processWordHits(req.body.originId, req.body.title);
      return res
        .status(409)
        .json({ message: `Article ${req.body.originId} already exists` });
    }

    console.log(`Insert article ${req.body.originId}`);
    await knex('articles').insert({
      originId: req.body.originId.substring(0, 128),
      originName: req.body.originName.substring(0, 64),
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
/**
 * Explode title and insert/update each word to database.
 *
 * @param {*} originId
 * @param {string} title
 */
async function processWordHits(originId, title) {
  // Remove special characters and split title into words
  const cleaned = title.replace(/[^a-öA-Ö0-9\s]/g, '');
  const exploded = cleaned.split(' ');

  // Iterate and insert/update to db
  for (const key in exploded) {
    const word = exploded[key].substring(0, 64).toLowerCase();
    if (word.length < 2) {
      continue;
    }
    const exists = await knex('word_hits').where('word', word).first();

    if (exists) {
      updateWordToDatabase(word);
    } else {
      try {
        insertWordToDatabase(word);
      } catch (e) {
        /**
         * The error is most likely duplicate entry because processWordHits is not waited. Just rerun the update.
         */
        updateWordToDatabase(word);
        // console.error(e);
      }
    }
  }
  await knex('articles').where('originId', originId).update({
    wordsProcessed: true,
    updatedAt: knex.fn.now(),
  });
}

/**
 * Insert new word to db.
 * @param {*} word
 */
async function insertWordToDatabase(word) {
  try {
    console.log(`Insert word ${word}`);
    await knex('word_hits').insert({
      word: word.substring(0, 64),
      hits: 1,
    });
  } catch (e) {
    console.error(e);
  }
}

/**
 * Update word hits to db.
 * @param {*} word
 */
async function updateWordToDatabase(word) {
  try {
    console.log(`Update word ${word}`);
    await knex('word_hits')
      .where('word', word)
      .update({
        hits: knex.raw('hits + 1'),
        updatedAt: knex.fn.now(),
      });
  } catch (e) {
    console.error(e);
  }
}
