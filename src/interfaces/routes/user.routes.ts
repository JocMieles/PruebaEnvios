import { Router } from "express";
import UserController from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.post("/register", authenticate as any, isAdmin as any, UserController.register as any);
router.post("/login", UserController.login);

export default router;