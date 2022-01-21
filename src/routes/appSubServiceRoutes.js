import express from 'express';
import { appSubServiceController } from '../controllers';
import { authMiddelware } from '../middleware';
import { validator } from '../validation';
const router = express.Router();

router.post(
	'/create',
	// validator.appSubServiceValidation,
	authMiddelware,
	appSubServiceController.create,
);
router.get('/get', authMiddelware, appSubServiceController.getAll);
router.put(
	'/update/:id',
	// validator.appSubServiceValidation,
	authMiddelware,
	appSubServiceController.update,
);
router.delete(
	'/delete/:id',
	authMiddelware,
	appSubServiceController.deletedata,
);
router.put('/restore/:id', authMiddelware, appSubServiceController.restore);
router.put('/status/:id', authMiddelware, appSubServiceController.updateStatus);
module.exports = router;
