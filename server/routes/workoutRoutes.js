import express from "express";
import {
  createWorkoutSession,
  getWorkoutSessions,
} from "../controllers/workoutController.js";
import protectRoutes from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protectRoutes);


router.post("/", createWorkoutSession);
router.get("/", getWorkoutSessions);

export default router;