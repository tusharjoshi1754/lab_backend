import express from 'express';
import { footerController } from '../controllers';
import { validator } from '../validation';
import { authMiddelware } from '../middleware';
const router = express.Router();

// website_header CRUD Routes
router.post(
	'/create',
	validator.callBackValidator,
	authMiddelware,
	footerController.createFooter,
);
router.get('/get', footerController.getFooter);
router.delete('/delete/:id', footerController.delereFooter);

module.exports = router;
