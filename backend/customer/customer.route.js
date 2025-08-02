import express from "express";
import paymentRoutes from "./payment/paymentRoutes.js";
import authRoutes from "./authentication/authRoute.js";
import restaurantRoutes from "./restaurant/restaurantRoutes.js";
import ordersRoutes from "./order/orderRoutes.js";
import cartRoutes from "./cart/cartRoutes.js";

const router = express.Router();

router.use("/payment", paymentRoutes);
router.use("/auth", authRoutes);
router.use("/restaurant", restaurantRoutes);
router.use("/cart", cartRoutes);
router.use("/order", ordersRoutes);

export default router;
