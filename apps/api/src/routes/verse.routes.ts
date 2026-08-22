import { Router } from "express";
import {
  getTodayVerse,
  getVerseHistory,
} from "../controllers/verse.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/today", getTodayVerse);
router.get("/", getVerseHistory);

export default router;
