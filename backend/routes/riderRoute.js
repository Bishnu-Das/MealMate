import express from "express";
import validinfo from "../middleware/validinfo.js";
import authorization from "../middleware/authorization.js";

import {
  signup as rider_signup,
  login as rider_login,
} from "../controllers/rider.controller.js";

const router = express.Router();

router.post("/register", validinfo, rider_signup);
router.post("/login", validinfo, rider_login);

router.get("/customer/is-varify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "internal server error" });
  }
});

export default router;
