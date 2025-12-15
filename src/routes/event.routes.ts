import { Router } from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../contollers/event.contoller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/", authMiddleware, createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.put("/:id", authMiddleware, updateEvent);
router.delete("/:id", authMiddleware, deleteEvent);

export default router;