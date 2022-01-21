import express from 'express';
import { validator } from '../validation';
import { callbackController } from '../controllers';
import { authMiddelware } from '../middleware';
const router = express.Router();

// call_back CRUD Routes
router.post(
	'/create',
	validator.callBackValidator,
	authMiddelware,
	callbackController.createCall_back,
);
router.get('/get', callbackController.getAllCall_back);
router.put(
	'/update/:id',
	validator.callBackValidator,
	authMiddelware,
	callbackController.updateCall_back,
);
router.delete(
	'/delete/:id',
	authMiddelware,
	callbackController.deleteCall_back,
);

module.exports = router;
