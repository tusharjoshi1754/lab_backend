import express from 'express';
import { validator } from '../../validation';
import { authMiddelware } from '../../middleware';
import { roleController } from '../../controllers';
const router = express.Router();

// Role CRUD Routes
router.post(
	'/create',
	validator.roleValidator,
	authMiddelware,
	roleController.createRole,
);

router.get('/get', authMiddelware, roleController.getRole);
router.put(
	'/update/:id',
	validator.roleValidator,
	authMiddelware,
	roleController.updateRole,
);
router.delete('/delete/:id', authMiddelware, roleController.deleteRole);

module.exports = router;
