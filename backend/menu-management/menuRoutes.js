// menu-management/menuRoutes.js

import express from "express";
//import { checkRestaurant } from "../middleware/checkRestaurant.js"; // Import checkRestaurant middleware
import {
  createMenuCategory,
  updateCategory,
  deleteCategory,
  createMenuItem,
  updateMenuItemDetails,
  removeMenuItem
} from "./menuController.js"; // Import controller functions
import authorization from "../middleware/authorization.js";
import { checkRestaurant } from "../middleware/checkRestaurant.js";

const router = express.Router();

// Add menu category
router.post("/restaurants/:id/categories",authorization,checkRestaurant,  createMenuCategory);

// Edit menu category
router.put("/categories/:id",authorization,checkRestaurant,  updateCategory);

// Delete menu category
router.delete("/categories/:id",authorization,checkRestaurant,  deleteCategory);

// Add menu item
router.post("/categories/:id/items",authorization,checkRestaurant,  createMenuItem);

// Update menu item
router.put("/menu-items/:id",authorization,checkRestaurant,  updateMenuItemDetails);

// Delete menu item
router.delete("/menu-items/:id",authorization,checkRestaurant,  removeMenuItem);

export default router;
