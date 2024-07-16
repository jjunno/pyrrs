/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('word_hits', function (table) {
    table.increments('id');
    table.string('word', 64).notNullable().unique();
    table.integer('hits').notNullable().defaultTo(0);

    table.timestamps(true, true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('word_hits');
};
