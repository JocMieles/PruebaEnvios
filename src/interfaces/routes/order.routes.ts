import { Router } from "express";
import OrderController from "../controllers/order.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { isUser } from "../middlewares/user.middleware";

const router = Router();

router.post("/create", authenticate as any, isUser as any, OrderController.create as any);
router.get("/order/:trackingNumber", authenticate as any, isUser as any, OrderController.getOrderByTrackingNumber as any);

export default router;