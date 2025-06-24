import express from "express";
import validinfo from "../middleware/validinfo.js";
import authorization from "../middleware/authorization.js";
import authorizeRoles from "../middleware/athorizeRoles.js";

import {
  changePassword,
  login as customer_login,
  signup as customer_signup,
  getCategories,
  getMenuItem,
  getMenus,
  getNearbyRestaurants,
  getProfile,
  getRestaurant,
  getRestaurants,
  logout,
  updateProfile,
  varifyUser,
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
router.get("/is-varify", authorization, authorizeRoles(role), varifyUser);
router.put(
  "/change_password",
  authorization,
  authorizeRoles(role),
  changePassword
);
router.get("/profile", authorization, authorizeRoles(role), getProfile);
router.put(
  "/update_profile",
  authorization,
  authorizeRoles(role),
  updateProfile
);
router.get("/getRestaurants", getRestaurants);
router.get("/getCategories", getCategories);
router.get("/menus", getMenus);
router.get("/menu/:id", getMenuItem);
router.get("/getRestaurant/:id", getRestaurant);
export default router;
