import express from 'express';
import { termsConditionController } from '../controllers';
import { validator } from '../validation';
import { authMiddelware } from '../middleware';
const router = express.Router();

// website_header CRUD Routes
router.post(
	'/create',
	validator.callBackValidator,
	authMiddelware,
	termsConditionController.createTermsCondition,
);
router.get('/get', termsConditionController.getTermsCondition);
router.delete(
	'/delete/:id',
	authMiddelware,
	termsConditionController.deleteTermsCondition,
);

module.exports = router;
