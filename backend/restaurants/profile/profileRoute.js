import express from "express";
//import validinfo from "../middleware/validinfo.js";
// import authorization from "../middleware/authorization.js";
// import authorizeRoles from "../middleware/athorizeRoles.js";
// import upload from "../middleware/upload.js";

import authorization from "../../middleware/authorization.js";
import authorizeRoles from "../../middleware/athorizeRoles.js";
import upload from "../../middleware/upload.js";
import {
  changePassword,
  editProfile,
  getRestaurantProfile,
} from "./profileController.js";

const role = "restaurant";

const router = express.Router();

router.get(
  "/get_restaurant_profile",
  authorization,
  authorizeRoles(role),
  getRestaurantProfile
);
router.post(
  "/edit_profile",
  authorization,
  authorizeRoles(role),
  upload.single("image"),
  editProfile
);
router.put(
  "/change_password",
  authorization,
  authorizeRoles(role),
  changePassword
);

export default router;
