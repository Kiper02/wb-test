import { WarehouseModel } from "#models/warehouseModel.js";

export class BoxWarehousesModel {
    constructor(model: { id?: string; dtNextBox: Date; dtTillMax: Date; warehouseList: WarehouseModel[]; createdAt?: Date; updatedAt?: Date }) {
        this.id = model.id;
        this.dtNextBox = model.dtNextBox;
        this.dtTillMax = model.dtTillMax;
        this.warehouseList = model.warehouseList;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    id?: string;
    dtNextBox: Date;
    dtTillMax: Date;
    warehouseList: WarehouseModel[];
    createdAt?: Date;
    updatedAt?: Date;
}
