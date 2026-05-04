import express from "express";
import {
  createWorkoutSession,
  getWorkoutSessions,
  getWorkoutStats,
} from "../controllers/WorkoutController.js";
import protectRoutes from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protectRoutes);


router.post("/", createWorkoutSession);
router.get("/stats", getWorkoutStats);
router.get("/", getWorkoutSessions);

export default router;
