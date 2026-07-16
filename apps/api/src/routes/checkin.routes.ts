import { Router } from "express";
import { createCheckIn } from "../controllers/checkin.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.use(requireAuth);

router.post("/", createCheckIn);

export default router;
