import { BoxModel } from "#models/boxModel.js";
import { boxDbService } from "#services/dbServices/boxDbService.js";
import { BoxWarehousesModel } from "#models/boxWarehousesModel.js";

class BoxService {
    public async create(box: BoxModel): Promise<BoxModel[]> {
        return await boxDbService.create(box);
    }

    public async update(box: BoxModel): Promise<BoxModel[]> {
        return boxDbService.update(box);
    }

    public async findById(boxId: number): Promise<BoxModel> {
        return new BoxModel(await boxDbService.findById(boxId));
    }

    public async findAll(): Promise<BoxModel[]> {
        const boxes = await boxDbService.findAll();
        return boxes.map((box: BoxModel) => new BoxModel(box));
    }

    public async findByCurrentDay() {
        return new BoxWarehousesModel(await boxDbService.findByCurrentDay());
    }

    public async findByDateTariffs(dtNextBox: Date | null, dtTillMax: Date | null): Promise<BoxModel> {
        return boxDbService.findByDateTariffs(dtNextBox, dtTillMax);
    }
}

export const boxService = new BoxService();
