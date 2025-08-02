import express from "express";
import authorization from "../../middleware/authorization.js";
import authorizeRoles from "../../middleware/athorizeRoles.js";
import {
  getOrders,
  getRecentOrders,
  updateOrderStatus,
} from "./orderController.js";

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

// restaurantOrder.put(
//   "/update_order_status",
//   authorization,
//   authorizeRoles(role),
//   updateStatus
// );

restaurantOrder.put(
  "/:orderId/status",
  authorization,
  authorizeRoles(role),
  updateOrderStatus
);

export default restaurantOrder;
