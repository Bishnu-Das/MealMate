import express from "express";
import authorization from "../../middleware/authorization.js";
import authorizeRoles from "../../middleware/athorizeRoles.js";
import upload from "../../middleware/upload.js";
import {
  add_menu,
  change_menu_availability,
  delete_menu,
  edit_menu,
  get_menu,
  get_menu_categories,
} from "./menuManagementController.js";

const router = express.Router();
const role = "restaurant";

router.post(
  "/add_menu",
  authorization,
  authorizeRoles(role),
  upload.single("image"),
  add_menu
);

router.put(
  "/edit_menu/:menu_item_id",
  authorization,
  authorizeRoles(role),
  upload.single("image"),
  edit_menu
);
router.put(
  "/change_availablity/:menu_item_id",
  authorization,
  authorizeRoles(role),
  change_menu_availability
);
router.delete(
  "/delete_menu/:menu_item_id",
  authorization,
  authorizeRoles(role),
  delete_menu
);
router.get("/get_menu_items", authorization, authorizeRoles(role), get_menu);
router.get(
  "/get_menu_categories",
  authorization,
  authorizeRoles(role),
  get_menu_categories
);

export default router;
