import express from 'express';
import * as paymentController from './paymentController.js';
import authorization from '../../middleware/authorization.js';

const router = express.Router();

router.post('/initiate', authorization, paymentController.initiatePayment);
router.get('/confirm', paymentController.confirmPayment);

export default router;
