/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    const exists = await knex.schema.hasTable('warehouses');
    if (!exists) {
        await knex.schema.createTable("warehouses", (table) => {
            table.increments("id").primary();
            table.integer("boxDeliveryAndStorageExpr");
            table.float("boxDeliveryBase", 3, 1);
            table.float("boxDeliveryLiter", 4, 2);
            table.float("boxStorageBase", 3, 2);
            table.float("boxStorageLiter", 3, 2);
            table.string("warehouseName", 255);

            table.integer("boxId").unsigned();
            table.foreign("boxId").references("id").inTable("box").onDelete("CASCADE");

            table.datetime("createdAt");
            table.datetime("updatedAt");
        });
        console.log('Таблица warehouses создана');
    } else {
        console.log('Таблица warehouses уже существует, пропускаем создание');
    }
};

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable("warehouses");
};