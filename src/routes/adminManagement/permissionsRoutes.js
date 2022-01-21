import express from 'express';
import { validator } from '../../validation';
import { authMiddelware } from '../../middleware';
import { permissionsController } from '../../controllers';
const router = express.Router();

// call_back CRUD Routes
router.post(
	'/create',
	validator.permissionsValidator,
	authMiddelware,
	permissionsController.createPermission,
);

router.get('/get', authMiddelware, permissionsController.getPermission);
router.put(
	'/update/:id',
	validator.permissionsValidator,
	authMiddelware,
	permissionsController.updatePermission,
);
router.delete(
	'/delete/:id',
	authMiddelware,
	permissionsController.deletePermission,
);

module.exports = router;
