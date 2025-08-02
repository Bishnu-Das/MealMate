import express from "express";

import authRoutes from "./authentication/authRoute.js";
import riderRoutes from "./riderRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/data", riderRoutes);

export default router;
