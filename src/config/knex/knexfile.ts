import dotenv from "dotenv";
dotenv.config();
import { z } from "zod";
import * as path from "path";
import type { Knex } from "knex";
import configUtil from "#utils/configUtil.js";

interface KnexConfig {
    development: Knex.Config;
    production: Knex.Config;
}

const connectionSchema = z.object({
    host: z.string(),
    port: z.number(),
    database: z.string(),
    user: z.string(),
    password: z.string(),
});

const NODE_ENV = configUtil("NODE_ENV") || "development";
const pathMigrations = path.join(process.cwd(), "src", "postgres", "migrations");
const pathSeeds = path.join(process.cwd(), "src", "postgres", "seeds");

const pathMigrationProd = path.join(process.cwd(), "dist", "postgres", "migrations");
const pathSeedsProd = path.join(process.cwd(), "dist", "postgres", "seeds");

const knexConfigs = {
    development: {
        client: "pg",
        connection: () =>
            connectionSchema.parse({
                host: configUtil("POSTGRES_HOST") || "localhost",
                port: Number(configUtil("POSTGRES_PORT")) || 5434,
                database: configUtil("POSTGRES_DB") || "wb_db",
                user: configUtil("POSTGRES_USER") || "postgres",
                password: configUtil("POSTGRES_PASSWORD") || "postgres",
            }),
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: pathMigrations,
            tableName: "knex_migrations",
            extension: "js",
        },
        seeds: {
            directory: pathSeeds,
        },
    },
    production: {
        client: "pg",
        connection: () =>
            connectionSchema.parse({
                host: configUtil("POSTGRES_HOST") || "localhost",
                port: Number(configUtil("POSTGRES_PORT")) || 5434,
                database: configUtil("POSTGRES_DB") || "wb_db",
                user: configUtil("POSTGRES_USER") || "postgres",
                password: configUtil("POSTGRES_PASSWORD") || "postgres",
            }),
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: pathMigrationProd,
            tableName: "migrations",
            extension: "js",
        },
        seeds: {
            directory: pathSeedsProd,
        },
    },
};

export default knexConfigs[NODE_ENV as keyof KnexConfig];
