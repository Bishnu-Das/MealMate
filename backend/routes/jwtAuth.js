import express from "express";

const router = express.Router();

router.post("/register", validinfo, customer_signup);
router.post("/login", validinfo, customer_login);

export default router;
