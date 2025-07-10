import express from "express";
import authorization from "../../middleware/authorization.js";
import authorizeRoles from "../../middleware/athorizeRoles.js";
import {
  getCategoryWiseSales,
  getLastMonthRevenueByWeek,
  getLastWeekRevenueByDay,
  getTopSellingItems,
} from "./statsController.js";

const restaurnatStat = express.Router();
const role = "restaurant";

restaurnatStat.get(
  "/daily_revenue",
  authorization,
  authorizeRoles(role),
  getLastWeekRevenueByDay
);
restaurnatStat.get(
  "/monthly_revenue",
  authorization,
  authorizeRoles(role),
  getLastMonthRevenueByWeek
);

restaurnatStat.get(
  "/top_selling_items",
  authorization,
  authorizeRoles(role),
  getTopSellingItems
);

restaurnatStat.get(
  "/category_wise_sell",
  authorization,
  authorizeRoles(role),
  getCategoryWiseSales
);

export default restaurnatStat;
