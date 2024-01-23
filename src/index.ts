import express, { Express } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import "./helpers/EnvConfig";
import {serve, setup} from "swagger-ui-express";
import * as swaggerDoc from "../swagger.json";
import router from "./routes/Grocery";
import logger from "./helpers/Logger";
import authMiddleware from "./helpers/Auth";
import errorMiddleware from "./helpers/ErrorHandler";


const app: Express = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(morgan("combined"));
app.use("/api", router)
app.use("/api-doc", serve, setup(swaggerDoc));
app.use(errorMiddleware);
process.on("uncaughtException", (error: Error, origin) => {
    console.log(error)
})
process.on("unhandledRejection", (error: Error, origin) => {
    console.log(error)
})
app.listen(port, () => {
    logger.info("App is running on port : " + port)
    console.log("App is running on port : " + port)
})