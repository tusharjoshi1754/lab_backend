import express from 'express';
import { sectionController } from '../controllers';
import { validator } from '../validation';
const router = express.Router();

router.get('/', sectionController.get);
router.get('/:id' , sectionController.getByid)
router.post('/create' ,validator.createSectionValidation, sectionController.post)
router.delete('/delete',sectionController.deleteSection)
router.put('/update' ,validator.updateSectionValidation, sectionController.updateSection)

module.exports = router;
