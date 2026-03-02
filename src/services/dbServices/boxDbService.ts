import { DbServiceBase } from "#services/dbServices/dbServiceBase.js";
import { BoxModel } from "#models/boxModel.js";

class BoxDbService extends DbServiceBase {
    constructor() {
        super();
    }
    public async create(box: BoxModel): Promise<BoxModel[]> {
        return this.Knex("box").insert(box).returning("*");
    }

    public async update(box: BoxModel): Promise<BoxModel[]> {
        return this.Knex("box").update(box).where({ id: box.id }).returning("*");
    }

    public async findById(boxId: number): Promise<BoxModel> {
        return this.Knex("box").where({ id: boxId }).first();
    }

    public async findAll(): Promise<BoxModel[]> {
        return this.Knex("box");
    }

    public async findByCurrentDay() {
        const today = new Date().toISOString().split("T")[0];
        const box = await this.Knex("box")
            .where("createdAt", ">=", `${today}T00:00:00`)
            .orderBy("createdAt", "DESC")
            .select("id", "dtNextBox", "dtTillMax", "createdAt", "updatedAt")
            .first();

        if (!box) return null;

        const warehouses = await this.Knex("warehouses").where("boxId", box.id).select("*");
        return {
            ...box,
            warehouseList: warehouses,
        };
    }

    public async findByDateTariffs(dtNextBox: Date | null, dtTillMax: Date | null): Promise<BoxModel> {
        const boxQuery = this.Knex("box");
        if (dtTillMax) {
            boxQuery.where({ dtTillMax });
        }
        if (dtNextBox) {
            boxQuery.andWhere({ dtTillMax });
        }
        return boxQuery.first();
    }
}

export const boxDbService = new BoxDbService();
