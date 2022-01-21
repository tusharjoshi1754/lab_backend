import express from 'express';
import { formsController } from '../controllers';
import { validator } from '../validation';
const router = express.Router();

router.get('/', formsController.get);
router.get('/:id' , formsController.getByid)
router.post('/create' ,validator.createFormValidation, formsController.post)
router.delete('/delete',formsController.deleteForm)
router.put('/update' ,validator.updateFormValidation, formsController.updateForms)

module.exports = router;
