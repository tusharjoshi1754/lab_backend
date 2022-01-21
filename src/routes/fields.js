import express from 'express';
import { fieldsController } from '../controllers';
import { validator } from '../validation';
const router = express.Router();

router.get('/', fieldsController.get);
router.get('/:id' , fieldsController.getByid)
router.post('/create' ,validator.createFieldsValidation, fieldsController.post)
router.delete('/delete',fieldsController.deleteField)
router.put('/update' ,validator.updateFieldsValidation, fieldsController.updateField)

module.exports = router;
