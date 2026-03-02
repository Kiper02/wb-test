/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    const exists = await knex.schema.hasTable('box');
    if (!exists) {
        await knex.schema.createTable("box", (table) => {
            table.increments("id").primary();
            table.datetime("dtNextBox").nullable();
            table.datetime("dtTillMax").nullable();
            table.datetime("createdAt");
            table.datetime("updatedAt");
        });
        console.log('Таблица box создана');
    } else {
        console.log('Таблица box уже существует, пропускаем создание');
    }
};

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable("box");
};
