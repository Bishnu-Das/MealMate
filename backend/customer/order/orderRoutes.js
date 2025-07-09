import express from 'express';
import * as orderController from './orderController.js';
import authorization from '../../middleware/authorization.js';

const router = express.Router();

router.post('/create', authorization, orderController.createOrder);
router.get('/', authorization, orderController.getOrders);
router.get('/:orderId', authorization, orderController.getOrderDetails);

export default router;
