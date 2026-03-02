import { google } from "googleapis";
import { boxService } from "#services/boxService.js";
import { IGoogleSheetRequest } from "#types/googleSheetType.js";
import { BoxWarehousesModel } from "#models/boxWarehousesModel.js";
import * as path from "path";
import configUtil from "#utils/configUtil.js";
import * as fs from "fs";

const boxesFields = ["id", "dtNextBox", "dtTillMax", "createdAt"];
const warehousesFields = [
    "id",
    "boxId",
    "boxDeliveryAndStorageExpr",
    "warehouseName",
    "boxDeliveryBase",
    "boxDeliveryLiter",
    "boxStorageBase",
    "boxStorageLiter",
    "warehouseName",
    "createdAt",
];

class GoogleSheetService {
    private sheets: any;
    private readonly credentialPath: string;

    constructor() {
        const __dirname = path.resolve();
        this.credentialPath = path.join(__dirname, "credentials.json");

        const keys = JSON.parse(fs.readFileSync(this.credentialPath, 'utf8'));

        const auth = new google.auth.JWT({
            email: keys.client_email,
            key: keys.private_key,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        this.sheets = google.sheets({ version: "v4", auth });
    }

    public async updateSheets() {
        const box = await boxService.findByCurrentDay();

        await this.updateBox(
            {
                spreadsheetId: configUtil("GOOGLE_SHEET_ID"),
                sheetName: "box",
            },
            box,
        );

        await this.updateWarehouses(
            {
                spreadsheetId: configUtil("GOOGLE_SHEET_ID"),
                sheetName: "stocks_coefs",
            },
            box,
        );
    }

    private async updateBox(request: IGoogleSheetRequest, box: BoxWarehousesModel) {
        const values = [boxesFields, [box.id, box.dtNextBox, box.dtTillMax, box.createdAt]];

        await this.sheets.spreadsheets.values.update({
            spreadsheetId: request.spreadsheetId,
            range: `${request.sheetName}!A1`,
            valueInputOption: "RAW",
            requestBody: { values },
        });
    }

    private async updateWarehouses(request: IGoogleSheetRequest, box: BoxWarehousesModel) {
        console.log(box.warehouseList);
        const values = [
            warehousesFields,
            ...box.warehouseList.map((warehouse) => [
                warehouse.id,
                warehouse.boxId,
                warehouse.boxDeliveryAndStorageExpr,
                warehouse.warehouseName,
                warehouse.boxDeliveryBase,
                warehouse.boxDeliveryLiter,
                warehouse.boxStorageBase,
                warehouse.boxStorageLiter,
                warehouse.warehouseName,
                warehouse.createdAt,
            ]),
        ];

        await this.sheets.spreadsheets.values.update({
            spreadsheetId: request.spreadsheetId,
            range: `${request.sheetName}!A1`,
            valueInputOption: "RAW",
            requestBody: { values },
        });
    }
}

export const googleSheetService = new GoogleSheetService();
