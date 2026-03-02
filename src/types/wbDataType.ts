export interface IBox {
    dtNextBox: Date | null;
    dtTillMax: Date | null;
    warehouseList: IWarehouse[];
}

export interface IWarehouse {
    boxDeliveryAndStorageExpr: string | number;
    boxDeliveryBase: string | number;
    boxDeliveryLiter: string | number;
    boxStorageBase: string | number;
    boxStorageLiter: string | number;
    warehouseName: string;
}
