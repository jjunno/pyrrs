/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('articles', function (table) {
    table.increments('id');
    table.string('originId', 128).notNullable().unique().index();
    table.string('originName', 64).notNullable();
    table.string('title', 255).notNullable();
    table.string('description', 255).notNullable();
    table.string('category', 255).notNullable();
    table.string('url', 255).notNullable();
    table.boolean('wordsProcessed').defaultTo(false);
    table.boolean('categoryProcessed').defaultTo(false);

    table.timestamps(true, true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('articles');
};
