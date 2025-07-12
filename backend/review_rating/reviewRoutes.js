import express from 'express';
import * as reviewController from './reviewController.js';
import authorization from '../middleware/authorization.js';
import authorizeRoles from '../middleware/athorizeRoles.js';

const router = express.Router();
const role = "customer";

// Route to submit a restaurant review
router.post('/restaurant', authorization, authorizeRoles(role), reviewController.submitRestaurantReview);

// Route to submit a rider review
router.post('/rider', authorization, authorizeRoles(role), reviewController.submitRiderReview);

// Route to get all reviews for a specific restaurant
router.get('/restaurant/:restaurantId', reviewController.getRestaurantReviews);

export default router;
