import { WarehouseModel } from "#models/warehouseModel.js";
import { warehouseDbService } from "#services/dbServices/warehouseDbService.js";

class WarehouseService {
    public async create(box: WarehouseModel): Promise<WarehouseModel[]> {
        return warehouseDbService.create(box);
    }

    public async findById(boxId: number): Promise<WarehouseModel> {
        return new WarehouseModel(await warehouseDbService.findById(boxId));
    }

    public async findAll(): Promise<WarehouseModel[]> {
        const boxes = await warehouseDbService.findAll();
        return boxes.map((warehouse: WarehouseModel) => new WarehouseModel(warehouse));
    }

    public async update(warehouse: WarehouseModel): Promise<WarehouseModel[]> {
        return await warehouseDbService.update(warehouse);
    }

    public async updateByBoxId(boxId: number, warehouse: WarehouseModel): Promise<WarehouseModel[]> {
        return warehouseDbService.updateByBoxId(boxId, warehouse);
    }
}

export const warehouseService = new WarehouseService();
