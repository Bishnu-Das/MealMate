import express from "express";
import validinfo from "../middleware/validinfo.js";
import authorization from "../middleware/authorization.js";
import authorizeRoles from "../middleware/athorizeRoles.js";

import {
  signup as rider_signup,
  login as rider_login,
  logout,
  varify,
} from "../controllers/rider.controller.js";
//import { changePassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", validinfo, rider_signup);
router.post("/login", validinfo, rider_login);
router.post("/logout", logout);

const role = "rider";

router.get(
  "/is-verify",
  authorization,
  authorizeRoles(role),
  varify
);
// router.get(
//   "/get_restaurant_profile",
//   authorization,
//   authorizeRoles(role),
//   getRestaurantProfile
// );
 export default router;