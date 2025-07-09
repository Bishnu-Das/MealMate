import express from "express";
import authorization from "../../middleware/authorization.js";
import authorizeRoles from "../../middleware/athorizeRoles.js";
import { getOrders, getRecentOrders } from "./orderController.js";

const restaurantOrder = express.Router();
const role = "restaurant";

restaurantOrder.get(
  "/recent_orders",
  authorization,
  authorizeRoles(role),
  getRecentOrders
);

restaurantOrder.get(
  "/all_orders",
  authorization,
  authorizeRoles(role),
  getOrders
);

export default restaurantOrder;
