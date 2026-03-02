export class BoxModel {
    constructor(model: { id?: string; dtNextBox: Date | null; dtTillMax: Date | null; createdAt?: Date; updatedAt?: Date }) {
        this.id = model.id;
        this.dtNextBox = model.dtNextBox;
        this.dtTillMax = model.dtTillMax;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }
    id?: string;
    dtNextBox: Date | null;
    dtTillMax: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}
