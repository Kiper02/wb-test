import knex from "knex";
import knexfile from "#config/knex/knexfile.js";

export class DbServiceBase {
    Knex;
    constructor() {
        this.Knex = knex(knexfile);
    }
}
