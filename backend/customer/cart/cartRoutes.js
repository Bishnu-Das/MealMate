import express from "express";
import authorization from "../../middleware/authorization.js";
import authorizeRoles from "../../middleware/athorizeRoles.js";
import { getCart, addToCart, deleteCartItem } from "./cartController.js";

const router = express.Router();
const role = "customer";

router.get("/", authorization, authorizeRoles(role), getCart);
router.post("/add_cart", authorization, authorizeRoles(role), addToCart);
router.delete(
  "/:cart_item_id",
  authorization,
  authorizeRoles(role),
  deleteCartItem
);

export default router;
