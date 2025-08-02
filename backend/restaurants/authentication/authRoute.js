import express from "express";
import validinfo from "../../middleware/validinfo.js";
import authorization from "../../middleware/authorization.js";
import authorizeRoles from "../../middleware/athorizeRoles.js";

import { login, logout, signup, varify } from "./authController.js";

const router = express.Router();
const role = "restaurant";

router.post("/register", validinfo, signup);
router.post("/login", validinfo, login);
router.get("/logout", logout);
router.get("/is-varify", authorization, authorizeRoles(role), varify);

export default router;
