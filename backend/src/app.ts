import express from "express";
import { EventController } from "./controllers/EventController";
import { NotificationService } from "./services/NotificationService";

const app = express();

app.use(express.json());

NotificationService.trigger();

/* add use routes below */

export default app;
