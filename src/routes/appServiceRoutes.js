import express from 'express';
import { appMainServiceController } from '../controllers';
import { authMiddelware } from '../middleware';
import { validator } from '../validation';
const router = express.Router();

// website_header CRUD Routes
router.post(
	'/create',
	validator.appMainServiceValidation,
	authMiddelware,
	appMainServiceController.createMainService,
);
router.get('/get', authMiddelware, appMainServiceController.getAllMainService);
router.put(
	'/update/:id',
	validator.appMainServiceValidation,
	authMiddelware,
	appMainServiceController.updateMainService,
);
router.delete(
	'/delete/:id',
	authMiddelware,
	appMainServiceController.deleteMainService,
);
router.put(
	'/restore/:id',
	authMiddelware,
	appMainServiceController.restoreMainService,
);
router.put(
	'/status/:id',
	authMiddelware,
	appMainServiceController.updateStatus,
);
module.exports = router;
