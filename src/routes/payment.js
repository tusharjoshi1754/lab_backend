import express from 'express';
import { paymentController } from '../controllers';
const router = express.Router();
import { authMiddelware } from '../middleware';
import { validator } from '../validation';

// website_header CRUD Routes
router.post(
	'/create',
	validator.createPaymentValidation,
	authMiddelware,
	paymentController.addPayment,
);

router.get('/get', paymentController.getPayment);
module.exports = router;
