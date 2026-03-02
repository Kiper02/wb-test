/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    const exists = await knex.schema.hasTable('spreadsheets');
    if (!exists) {
        await knex.schema.createTable("spreadsheets", (table) => {
            table.string("spreadsheet_id").primary();
        });
        console.log('Таблица spreadsheets создана');
    } else {
        console.log('Таблица spreadsheets уже существует, пропускаем создание');
    }
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable("spreadsheets");
}
