import express from 'express';
import { assayFinishedController } from '../controllers';
import { validator } from '../validation';
const router = express.Router();

router.get('/', assayFinishedController.get);
router.get('/:id', assayFinishedController.getByid);
router.post(
	'/create',
	validator.createAssayFinishedValidation,
	assayFinishedController.post,
);
router.delete('/delete', assayFinishedController.deleteData);
router.put(
	'/update',
	validator.updateAssayFinishedValidation,
	assayFinishedController.updateData,
);

module.exports = router;
