import { Router } from "express";
import {
  registerForEvent,
  getUserEvents,
} from "../contollers/participant.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();
router.post("/events/:id/register", authMiddleware, registerForEvent);
router.get("/user/events", authMiddleware, getUserEvents);

export default router;