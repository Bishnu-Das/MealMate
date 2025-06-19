import express from "express";
import validinfo from "../middleware/validinfo.js";
import authorization from "../middleware/authorization.js";
import authorizeRoles from "../middleware/athorizeRoles.js";

import {
  signup as resturant_signup,
  login as restaurant_login,
  add_menu,
  edit_menu,
  delete_menu,
  changePassword,
  logout,
} from "../controllers/restaurant.controller.js";

const router = express.Router();
const role = "restaurant";

router.post("/register", validinfo, resturant_signup);
router.post("/login", validinfo, restaurant_login);
router.get("/logout", logout);
router.post("/add_menu", authorization, authorizeRoles("restaurant"), add_menu);
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
  "/edit_menu/:menu_item_id",
  authorization,
  authorizeRoles(role),
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

export default router;
