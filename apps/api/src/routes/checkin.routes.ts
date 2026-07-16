import { Router } from "express";
import {
  createCheckIn,
  getStats,
  getCheckIns,
} from "../controllers/checkin.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.use(requireAuth);

router.post("/", createCheckIn);
router.get("/stats", getStats);
router.get("/", getCheckIns);

export default router;
