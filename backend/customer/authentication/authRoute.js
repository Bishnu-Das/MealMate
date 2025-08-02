import express from "express";
import validinfo from "../../middleware/validinfo.js";
import authorization from "../../middleware/authorization.js";
import authorizeRoles from "../../middleware/athorizeRoles.js";
import {
  changePassword,
  getProfile,
  login,
  logout,
  signup,
  updateProfile,
  varifyUser,
} from "./auth.Controller.js";

const router = express.Router();
const role = "customer";

router.post("/register", validinfo, signup);
router.post("/login", validinfo, login);
router.get("/logout", logout);
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

export default router;
