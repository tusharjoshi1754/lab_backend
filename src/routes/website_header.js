import express from 'express';
import { headerController } from '../controllers';
import { validator } from '../validation';
import { authMiddelware } from '../middleware';
const router = express.Router();

// website_header CRUD Routes
router.post(
	'/create',
	validator.headerValidator,
	headerController.createHeader,
);
router.get('/get', headerController.getHeader);
router.delete('/delete/:id', headerController.deleteHeader);

module.exports = router;
