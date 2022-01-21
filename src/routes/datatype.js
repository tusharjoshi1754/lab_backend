import express from 'express';
import { dataTypeController } from '../controllers';
const router = express.Router();

router.get('/', dataTypeController.get);
router.post('/create' , dataTypeController.post)
router.get('/:id' , dataTypeController.getByid)
module.exports = router;
