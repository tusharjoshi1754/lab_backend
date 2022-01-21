import express from 'express';
import { authMiddelware } from '../middleware';
import { aboutController } from '../controllers';
import { validator } from '../validation';
const router = express.Router();

// website_about CRUD Routes
router.post(
	'/create',
	validator.aboutValidator,
	authMiddelware,
	aboutController.createAbout,
);
router.get('/get', aboutController.getAllAbout);
router.put(
	'/update/:id',
	validator.aboutValidator,
	authMiddelware,
	aboutController.updateAbout,
);
router.delete('/delete/:id', authMiddelware, aboutController.deleteAbout);

module.exports = router;
