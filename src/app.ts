import "dotenv/config";
import express from "express";
import wbDataWorker from "#utils/workers/wbDataWorker.js";
import configUtil from "#utils/configUtil.js";

await wbDataWorker();

const app = express();
const port = configUtil("APP_PORT") || 5000;

app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});
