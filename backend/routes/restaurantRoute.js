import express from "express";
import validinfo from "../middleware/validinfo.js";
import authorization from "../middleware/authorization.js";
import authorizeRoles from "../middleware/athorizeRoles.js";
import upload from "../middleware/upload.js";

import {
  signup as resturant_signup,
  login as restaurant_login,
  add_menu,
  edit_menu,
  delete_menu,
  changePassword,
  logout,
  varify,
  get_menu,
  getRestaurantProfile,
  editProfile,
  updateOrderStatus,
  get_orders,
} from "../controllers/restaurant.controller.js";

const router = express.Router();
const role = "restaurant";

router.post("/register", validinfo, resturant_signup);
router.post("/login", validinfo, restaurant_login);
router.get("/logout", logout);
router.post(
  "/add_menu",
  authorization,
  authorizeRoles(role),
  upload.single("image"),
  add_menu
);
router.get("/is-varify", authorization, authorizeRoles(role), varify);
router.put(
  "/edit_menu/:menu_item_id",
  authorization,
  authorizeRoles(role),
  upload.single("image"),
  edit_menu
);
router.delete(
  "/delete_menu/:menu_item_id",
  authorization,
  authorizeRoles(role),
  delete_menu
);

router.put(
  "/change_password",
  authorization,
  authorizeRoles(role),
  changePassword
);
router.get("/get_menu_items", authorization, authorizeRoles(role), get_menu);
router.get(
  "/get_restaurant_profile",
  authorization,
  authorizeRoles(role),
  getRestaurantProfile
);
router.post("/edit_profile", authorization, authorizeRoles(role), editProfile);
router.put(
  "/orders/:orderId/status",
  authorization,
  authorizeRoles(role),
  updateOrderStatus
);
router.get("/orders", authorization, authorizeRoles(role), get_orders);
export { router };
