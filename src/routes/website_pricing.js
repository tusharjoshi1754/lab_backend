import express from 'express';
import { pricingController } from '../controllers';
import { validator } from '../validation';
import { authMiddelware } from '../middleware';
const router = express.Router();

// website_pricing CRUD Routes
router.post(
	'/create',
	validator.priceValidator,
	authMiddelware,
	pricingController.createPricing,
);
router.get('/get', pricingController.getPricing);
router.put('/update/:id', authMiddelware, pricingController.updatePricing);
router.delete('/delete/:id', authMiddelware, pricingController.deletePricing);

module.exports = router;
