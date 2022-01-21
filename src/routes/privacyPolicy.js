import express from 'express';
import { privacyPolicyController } from '../controllers';
import { validator } from '../validation';
import { authMiddelware } from '../middleware';
const router = express.Router();

// website_header CRUD Routes
router.post(
	'/create',
	validator.termsConditionValidator,
	authMiddelware,
	privacyPolicyController.createPrivacyPolicy,
);
router.get('/get', privacyPolicyController.getPrivacyPolicy);
router.delete(
	'/delete/:id',
	authMiddelware,
	privacyPolicyController.deletePrivacyPolicy,
);

module.exports = router;
