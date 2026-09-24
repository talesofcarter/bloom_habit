import { Router } from "express";
import {
  createCheckIn,
  getStats,
  getCheckIns,
  updateCheckIn,
  deleteCheckIn,
} from "../controllers/checkin.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.use(requireAuth);

router.post("/", createCheckIn);
router.get("/stats", getStats);
router.get("/", getCheckIns);
router.put("/:id", updateCheckIn);
router.delete("/:id", deleteCheckIn);

export default router;
