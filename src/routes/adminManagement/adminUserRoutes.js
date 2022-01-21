import express from 'express';
import { validator } from '../../validation';
import { authMiddelware, resetPasswordMiddelware } from '../../middleware';
import { adminUserController } from '../../controllers';
const router = express.Router();

// call_back CRUD Routes
router.post(
	'/create',
	// validator.adminUserValidation,
	authMiddelware,
	adminUserController.adminUserCreate,
);
router.post(
	'/login',
	validator.adminUserLoginValidation,
	adminUserController.adminUserLogin,
);

router.get('/get', authMiddelware, adminUserController.adminUserList);
router.put(
	'/update/:id',
	validator.adminUserUpdateValidation,
	authMiddelware,
	adminUserController.adminUserUpdate,
);
router.put('/status/:id', authMiddelware, adminUserController.adminUserStatus);
router.delete(
	'/delete/:id',
	authMiddelware,
	adminUserController.adminUserDelete,
);

router.put(
	'/changePassword',
	validator.adminUserPasswordChangeValidation,
	authMiddelware,
	adminUserController.adminUserChangePassword,
);

router.post(
	'/forget-password',
	validator.forgetPasswordValidation,
	adminUserController.forgetPassword,
);
router.put(
	'/reset-password',
	validator.resetPasswordValidation,
	resetPasswordMiddelware,
	adminUserController.resetPassword,
);

module.exports = router;
