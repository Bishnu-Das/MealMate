import express from "express";
import validinfo from "../middleware/validinfo.js";
import authorization from "../middleware/authorization.js";

import {
  signup as resturant_signup,
  login as restaurant_login,
} from "../controllers/restaurant.controller.js";

const router = express.Router();

router.post("/register", validinfo, resturant_signup);
router.post("/login", validinfo, restaurant_login);

router.get("/customer/is-varify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "internal server error" });
  }
});

export default router;
