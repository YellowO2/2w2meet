import express from "express";
import bodyParser from "body-parser";
import { NotificationService } from "./services/NotificationService";
import eventRouter from "./routes/event";
import { errorHandler } from "./middlewares/ErrorHandler";
import { logger } from "./middlewares/Logger";

const app = express();

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);

NotificationService.trigger();

/* add use routes below */
app.get("/", (req, res) => {
	res.send("hello world!");
});

app.use("/api/event", eventRouter);

app.use(errorHandler);

export default app;
