import express from "express";
import authorization from "../../middleware/authorization.js";
import authorizeRoles from "../../middleware/athorizeRoles.js";
import {
  getCategoryWiseSales,
  getLastMonthRevenueByWeek,
  getLastTwoWeekNewCustomer,
  getLastTwoWeekOrderCount,
  getLastTwoWeekRevenue,
  getLastWeekRevenueByDay,
  getTopSellingItems,
  todaysOrderStat,
} from "./statsController.js";

const restaurnatStat = express.Router();
const role = "restaurant";

restaurnatStat.get(
  "/today_stat",
  authorization,
  authorizeRoles(role),
  todaysOrderStat
);

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
restaurnatStat.get(
  "/last_two_week_revenue",
  authorization,
  authorizeRoles(role),
  getLastTwoWeekRevenue
);
restaurnatStat.get(
  "/last_two_week_order_count",
  authorization,
  authorizeRoles(role),
  getLastTwoWeekOrderCount
);
restaurnatStat.get(
  "/last_two_week_new_customer",
  authorization,
  authorizeRoles(role),
  getLastTwoWeekNewCustomer
);

export default restaurnatStat;
