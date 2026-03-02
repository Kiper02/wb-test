import cron from "node-cron";
import { IBox, IWarehouse } from "#types/wbDataType.js";
import { boxService } from "#services/boxService.js";
import { BoxModel } from "#models/boxModel.js";
import { WarehouseModel } from "#models/warehouseModel.js";
import { warehouseService } from "#services/warehouseService.js";
import { googleSheetService } from "#lib/googleSheetService.js";
import configUtil from "#utils/configUtil.js";

const getBoxes = async () => {
    const api = configUtil("WB_API");
    const key = configUtil("WB_KEY");
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const formattedDate = `date=${year}-${month}-${day}`;

    const response = await fetch(`${api}/tariffs/box?${formattedDate}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`,
        },
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const json = await response.json();
    if (!json?.response?.data) {
        throw new Error("Invalid response structure from WB API");
    }
    return json.response.data;
};

const saveWarehouse = async (warehouses: IWarehouse[], boxId: number, operation: "update" | "create") => {
    console.log(warehouses, boxId, operation);
    warehouses = replaceFloatValues(warehouses);
    console.log(`warehouses`, warehouses);
    await Promise.all(
        warehouses.map(async (warehouse) => {
            const warehouseModel = new WarehouseModel({
                ...warehouse,
                boxId,
            });

            switch (operation) {
                case "create":
                    return warehouseService.create({
                        ...warehouseModel,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                case "update":
                    return warehouseService.updateByBoxId(boxId, {
                        ...warehouseModel,
                        updatedAt: new Date(),
                    });
                default:
                    throw new Error("Operation not supported");
            }
        }),
    );
};

const saveBox = async (box: IBox) => {
    const dtNextBox = box.dtNextBox ? new Date(box.dtNextBox) : null;
    const dtTillMax = box.dtTillMax ? new Date(box.dtTillMax) : null;
    const existingBox = await boxService.findByDateTariffs(dtNextBox, dtTillMax);
    console.log(`existingBox`, existingBox);
    const boxModel = new BoxModel(box);
    if (!existingBox) {
        const boxData = await boxService.create({
            ...boxModel,
            createdAt: new Date(),
            updatedAt: new Date(),
            dtNextBox: box.dtNextBox ? new Date(box.dtNextBox) : null,
            dtTillMax: box.dtTillMax ? new Date(box.dtTillMax) : null,
        });
        if (boxData[0] && boxData[0]?.id) {
            return saveWarehouse(box.warehouseList, Number(boxData[0].id), "create");
        }
    } else {
        if (existingBox?.id) {
            return saveWarehouse(box.warehouseList, Number(existingBox.id), "update");
        }
    }
};

function replaceFloatValues(warehouses: IWarehouse[]): IWarehouse[] {
    return warehouses.map((warehouse) => {
        return {
            ...warehouse,
            boxDeliveryAndStorageExpr: Number(warehouse.boxDeliveryAndStorageExpr),
            boxDeliveryBase: Number(warehouse.boxDeliveryBase.toString().replace(",", ".")),
            boxDeliveryLiter: Number(warehouse.boxDeliveryLiter.toString().replace(",", ".")),
            boxStorageBase: warehouse.boxStorageBase === "-" ? 0 : Number(warehouse.boxStorageBase?.toString().replace(",", ".") || "0"),
            boxStorageLiter: warehouse.boxStorageLiter === "-" ? 0 : Number(warehouse.boxStorageLiter?.toString().replace(",", ".") || "0"),
        };
    });
}

export default async function wbDataWorker() {
    const job = async () => {
        try {
            console.log("Starting WB data sync...");
            const box = await getBoxes();
            await saveBox(box);
            await googleSheetService.updateSheets();
            console.log("WB data sync completed");
        } catch (error) {
            console.error("Error in WB worker:", error);
        }
    };
    job().catch(console.error);
    cron.schedule("* * * * *", job);
}
