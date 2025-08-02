// routes/restaurant/restaurant.routes.js
import express from "express";

import restaurantOrder from "./order/orderRoutes.js";
import restaurnatStat from "./stats/statsRoutes.js";
import authRoutes from "./authentication/authRoute.js";
import menuRoutes from "./menu_management/menuManagementRoute.js";
import reviewRoutes from "./review/reviewRoute.js";
import profileRoutes from "./profile/profileRoute.js";

const router = express.Router();

// Prefix all sub-routes with their respective paths
router.use("/auth", authRoutes); // /restaurant/auth/...
router.use("/menu", menuRoutes); // /restaurant/menu/...
router.use("/profile", profileRoutes); // /restaurant/profile/...
router.use("/review", reviewRoutes); // /restaurant/reviews/...
router.use("/stat", restaurnatStat);
router.use("/order", restaurantOrder);

export default router;
