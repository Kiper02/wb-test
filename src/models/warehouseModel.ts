export class WarehouseModel {
    constructor(model: {
        id?: number;
        boxDeliveryAndStorageExpr: string | number;
        boxDeliveryBase: string | number;
        boxDeliveryLiter: string | number;
        boxStorageBase: string | number;
        boxStorageLiter: string | number;
        warehouseName: string;
        boxId: number;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.id = model.id;
        this.boxDeliveryAndStorageExpr = model.boxDeliveryAndStorageExpr;
        this.boxDeliveryBase = model.boxDeliveryBase;
        this.boxDeliveryLiter = model.boxDeliveryLiter;
        this.boxStorageBase = model.boxStorageBase;
        this.boxStorageLiter = model.boxStorageLiter;
        this.warehouseName = model.warehouseName;
        this.boxId = model.boxId;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    id?: number;
    boxDeliveryAndStorageExpr: string | number;
    boxDeliveryBase: string | number;
    boxDeliveryLiter: string | number;
    boxStorageBase: string | number;
    boxStorageLiter: string | number;
    warehouseName: string;
    boxId: number;
    createdAt?: Date;
    updatedAt?: Date;
}
