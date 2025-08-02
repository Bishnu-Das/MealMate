import express from "express";
import authorization from "../../middleware/authorization.js";
import authorizeRoles from "../../middleware/athorizeRoles.js";
import { getIndividualMenuReview, getReviewsAll } from "./reviewController.js";

const router = express.Router();
const role = "restaurant";
router.get("/", authorization, authorizeRoles(role), getReviewsAll);
router.get(
  "/menu/:id",
  authorization,
  authorizeRoles(role),
  getIndividualMenuReview
);

export default router;
