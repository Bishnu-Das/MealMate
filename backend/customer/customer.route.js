import express from "express";
import createCustomerPaymentRoutes from "./payment/paymentRoutes.js";
import authRoutes from "./authentication/authRoute.js";
import restaurantRoutes from "./restaurant/restaurantRoutes.js";
import ordersRoutes from "./order/orderRoutes.js";
import cartRoutes from "./cart/cartRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const store_id = process.env.SSL_COMMERZ_STORE_ID;
const store_passwd = process.env.SSL_COMMERZ_STORE_PASSWORD;

const router = express.Router();

const paymentRoutes = createCustomerPaymentRoutes(store_id, store_passwd);

router.use("/payment", paymentRoutes);
router.use("/auth", authRoutes);
router.use("/restaurant", restaurantRoutes);
router.use("/cart", cartRoutes);
router.use("/order", ordersRoutes);

export default router;
