/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('category_hits', function (table) {
    table.increments('id');
    table.string('category', 32).notNullable().unique().index();
    table.integer('hits').notNullable().defaultTo(1);

    table.timestamps(true, true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('category_hits');
};
