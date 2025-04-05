import { Router } from "express";
import { EventController } from "../controllers/EventController";

const router = Router();

router.get("/:id", EventController.readEvent);
router.post("/", EventController.createEvent);
router.put("/:id", EventController.updateEvent);

export default router;
