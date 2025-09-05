import express from "express";
import {
	createOrder,
	payOrder,
	cancelOrder,
	getOrders,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.put("/:id/pay", payOrder);
router.put("/:id/cancel", cancelOrder);
router.get("/", getOrders);

export default router;
