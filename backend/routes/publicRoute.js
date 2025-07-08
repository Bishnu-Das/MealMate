import express from "express";
import {
  get_cetegories,
  get_menu,
  get_restaurant_details,
} from "../controllers/public.controller.js";

const router = express.Router();

router.get("/get_menu/:id", get_menu);
router.get("/get_categories/:id", get_cetegories);
router.get("/get_restaurant_details/:id", get_restaurant_details);

export default router;
