import express from "express";
import validinfo from "../middleware/validinfo.js";
import authorization from "../middleware/authorization.js";
import authorizeRoles from "../middleware/athorizeRoles.js";

import {
  changePassword,
  login as customer_login,
  signup as customer_signup,
  getNearbyRestaurants,
  logout,
} from "../controllers/auth.controller.js";

const router = express.Router();
const role = "customer";

router.post("/register", validinfo, customer_signup);
router.post("/login", validinfo, customer_login);
router.get("/logout", logout);
router.get(
  "/nearby_restaurant",
  authorization,
  authorizeRoles(role),
  getNearbyRestaurants
);
router.get(
  "/is-varify",
  authorization,
  authorizeRoles(role),
  async (req, res) => {
    try {
      res.json(true);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  }
);
router.put(
  "/change_password",
  authorization,
  authorizeRoles(role),
  changePassword
);

export default router;
