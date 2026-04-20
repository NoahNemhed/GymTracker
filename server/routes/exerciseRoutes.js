import express from "express";
import { getExercises, getExerciseById } from "../controllers/exerciseController.js";
import protectRoutes from "../middleware/authMiddleware.js";


const router = express.Router();
router.use(protectRoutes);


router.get("/", getExercises);

router.get("/:id", getExerciseById);

export default router;