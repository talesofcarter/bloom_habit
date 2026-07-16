import { Router } from "express";
import { updatePassword, deleteAccount } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.use(requireAuth);

router.put("/password", updatePassword);
router.delete("/", deleteAccount);

export default router;
