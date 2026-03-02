import { DbServiceBase } from "#services/dbServices/dbServiceBase.js";
import { WarehouseModel } from "#models/warehouseModel.js";

class WarehouseDbService extends DbServiceBase {
    constructor() {
        super();
    }
    public async create(warehouse: WarehouseModel): Promise<WarehouseModel[]> {
        return this.Knex("warehouses").insert(warehouse).returning("*");
    }

    public async update(warehouse: WarehouseModel): Promise<WarehouseModel[]> {
        return this.Knex("warehouses").update(warehouse).where({ id: warehouse.id }).returning("*");
    }

    public async updateByBoxId(boxId: number, warehouse: WarehouseModel): Promise<WarehouseModel[]> {
        const existingWarehouses = await this.Knex("warehouses").where({ boxId }).select("id").orderBy("id");

        if (!existingWarehouses.length) {
            return [];
        }
        const updateData = {
            boxDeliveryAndStorageExpr: warehouse.boxDeliveryAndStorageExpr,
            boxDeliveryBase: warehouse.boxDeliveryBase,
            boxDeliveryLiter: warehouse.boxDeliveryLiter,
            boxStorageBase: warehouse.boxStorageBase,
            boxStorageLiter: warehouse.boxStorageLiter,
            warehouseName: warehouse.warehouseName,
            updatedAt: new Date(),
        };

        return await this.withDeadlockRetry(async () => {
            return this.Knex.transaction(async (trx) => {
                const updatedWarehouses = [];

                for (const { id } of existingWarehouses) {
                    const [updated] = await trx("warehouses").update(updateData).where({ id }).returning("*");

                    updatedWarehouses.push(updated);
                }

                return updatedWarehouses;
            });
        });
    }

    private async withDeadlockRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
        try {
            return await fn();
        } catch (error: unknown) {
            if (error instanceof Error && "code" in error && error.code === "40P01" && retries > 0) {
                const delay = Math.pow(2, 4 - retries) * 100;
                await new Promise((resolve) => setTimeout(resolve, delay));
                return this.withDeadlockRetry(fn, retries - 1);
            }
            throw error;
        }
    }

    public async findById(warehouseId: number): Promise<WarehouseModel> {
        return this.Knex("warehouses").where({ id: warehouseId }).first();
    }

    public async findAll(): Promise<WarehouseModel[]> {
        return this.Knex("warehouses");
    }
}

export const warehouseDbService = new WarehouseDbService();
