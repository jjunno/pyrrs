/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('articles', function (table) {
    table.increments('id');
    table.string('origin_id', 128).notNullable().unique();
    table.string('origin_name', 64).notNullable();
    table.string('title', 255).notNullable();
    table.string('description', 255).notNullable();
    table.string('category', 255).notNullable();
    table.string('url', 255).notNullable();
    table.string('image_url', 255).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('articles');
};
