import express from 'express';
import { appController } from '../controllers';
import { authMiddelware } from '../middleware';
import { validator } from '../validation';
const router = express.Router();

// website_header CRUD Routes
router.post(
	'/create',
	validator.appModelValidation,
	authMiddelware,
	appController.createApp,
);
router.get('/get', authMiddelware, appController.getApp);
router.put(
	'/update/:id',
	validator.appModelValidation,
	authMiddelware,
	appController.updateApp,
);
router.delete('/delete/:id', authMiddelware, appController.deleteApp);
router.put('/restore/:id', authMiddelware, appController.restoreApp);
router.put('/status/:id', authMiddelware, appController.updateStatus);
module.exports = router;
