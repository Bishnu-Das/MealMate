import express from "express";
import validinfo from "../middleware/validinfo.js";
import authorization from "../middleware/authorization.js";
import authorizeRoles from "../middleware/athorizeRoles.js";

import {
  signup as rider_signup,
  login as rider_login,
  logout,
} from "../controllers/rider.controller.js";
import { changePassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", validinfo, rider_signup);
router.post("/login", validinfo, rider_login);
router.get("/logout", logout);

const role = "rider";

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
