import express from "express";
import validinfo from "../middleware/validinfo.js";
import authorization from "../middleware/authorization.js";

import {
  signup as resturant_signup,
  login as restaurant_login,
  add_menu,
} from "../controllers/restaurant.controller.js";
import { logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", validinfo, resturant_signup);
router.post("/login", validinfo, restaurant_login);
router.get("/logout", logout);
router.post("/add-menu", authorization, add_menu);
router.get("/is-varify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "internal server error" });
  }
});

export default router;
