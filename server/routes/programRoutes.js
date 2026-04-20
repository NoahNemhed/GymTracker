import express from "express";
import {
  createProgram,
  getPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
} from "../controllers/programController.js";
import protectRoutes from "../middleware/authMiddleware.js";


const router = express.Router();
router.use(protectRoutes);


router.post("/", createProgram);
router.get("/", getPrograms);
router.get("/:id", getProgramById);
router.put("/:id", updateProgram);
router.delete("/:id", deleteProgram);

export default router;